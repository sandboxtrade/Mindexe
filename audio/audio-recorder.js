// MIND.EXE — MediaRecorder wrapper tuned for iPhone/PWA reliability.
// Records a durable local Blob first; Gemini transcription happens only after stop().

const MIME_CANDIDATES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm",
  "audio/ogg;codecs=opus"
];

export function chooseAudioMime(MediaRecorderImpl = globalThis.MediaRecorder) {
  if (!MediaRecorderImpl) return "";
  for (const mime of MIME_CANDIDATES) {
    try {
      if (typeof MediaRecorderImpl.isTypeSupported !== "function" || MediaRecorderImpl.isTypeSupported(mime)) return mime;
    } catch (_) {}
  }
  return "";
}

export function createAudioRecorder({
  navigatorObj = globalThis.navigator,
  MediaRecorderImpl = globalThis.MediaRecorder,
  now = () => Date.now(),
  onChunk = null,
  onLevel = null,
  onError = null,
  timesliceMs = 2000
} = {}) {
  let recorder = null;
  let stream = null;
  let chunks = [];
  let startedAt = 0;
  let audioContext = null;
  let levelTimer = null;
  let starting = false;
  let generation = 0;

  function supported() {
    return !!(navigatorObj?.mediaDevices?.getUserMedia && MediaRecorderImpl);
  }

  async function start() {
    if (!supported()) throw new Error("audio_recording_unsupported");
    if (starting || (recorder && recorder.state !== "inactive")) throw new Error("audio_already_recording");
    starting = true;
    const myGeneration = ++generation;
    try {
      stream = await navigatorObj.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      if (myGeneration !== generation) {
        cleanup();
        throw new Error("audio_start_cancelled");
      }
      chunks = [];
      const mimeType = chooseAudioMime(MediaRecorderImpl);
      try {
        recorder = mimeType
          ? new MediaRecorderImpl(stream, { mimeType, audioBitsPerSecond: 64000 })
          : new MediaRecorderImpl(stream);
      } catch (_) {
        recorder = new MediaRecorderImpl(stream);
      }
      const current = recorder;
      current.onerror = () => {
        try { onError?.(current.error || new Error("audio_recording_failed")); } catch (_) {}
        cleanup();
      };
      current.ondataavailable = (event) => {
        if (current !== recorder || !event?.data?.size) return;
        chunks.push(event.data);
        try {
          onChunk?.(event.data, {
            chunkCount: chunks.length,
            mimeType: recorder?.mimeType || mimeType || event.data.type || "application/octet-stream",
            startedAt,
            durationMs: Math.max(0, now() - startedAt)
          });
        } catch (_) {}
      };
      startedAt = now();
      recorder.start(Math.max(500, Number(timesliceMs) || 2000));

      try {
        const AudioContextCtor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (AudioContextCtor && onLevel) {
          audioContext = new AudioContextCtor();
          audioContext.resume?.().catch(() => {});
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          const samples = new Float32Array(analyser.fftSize);
          levelTimer = setInterval(() => {
            analyser.getFloatTimeDomainData(samples);
            const rms = Math.sqrt(samples.reduce((sum, sample) => sum + sample * sample, 0) / samples.length);
            try { onLevel(Math.min(1, rms * 8)); } catch (_) {}
          }, 120);
        }
      } catch (_) {}

      return { mimeType: recorder.mimeType || mimeType || "application/octet-stream", startedAt };
    } catch (error) {
      cleanup();
      throw error;
    } finally {
      starting = false;
    }
  }

  async function stop() {
    if (!recorder || recorder.state === "inactive") throw new Error("audio_not_recording");
    const current = recorder;
    let timeout = null;
    try {
      return await new Promise((resolve, reject) => {
        timeout = setTimeout(() => reject(new Error("audio_stop_timeout")), 12000);
        const fail = () => reject(current.error || new Error("audio_recording_failed"));
        current.onerror = fail;
        current.onstop = () => {
          try {
            const type = current.mimeType || chunks[0]?.type || "application/octet-stream";
            const blob = new Blob(chunks, { type });
            resolve({
              blob,
              mimeType: type,
              durationMs: Math.max(0, now() - startedAt),
              startedAt
            });
          } catch (error) {
            reject(error);
          }
        };
        try { current.requestData?.(); } catch (_) {}
        try { current.stop(); } catch (error) { reject(error); }
      });
    } finally {
      clearTimeout(timeout);
      cleanup();
    }
  }

  function cleanup() {
    clearInterval(levelTimer);
    levelTimer = null;
    try { audioContext?.close?.().catch(() => {}); } catch (_) {}
    audioContext = null;
    if (recorder) {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
    }
    try { stream?.getTracks?.().forEach((track) => track.stop()); } catch (_) {}
    recorder = null;
    stream = null;
    chunks = [];
    startedAt = 0;
  }

  function cancel() {
    generation += 1;
    try {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    } catch (_) {}
    cleanup();
  }

  function isRecording() {
    return !!recorder && recorder.state === "recording";
  }

  return { supported, start, stop, cancel, isRecording };
}
