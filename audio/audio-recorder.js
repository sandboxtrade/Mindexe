// MIND.EXE — MediaRecorder wrapper tuned for iPhone/PWA reliability.
// Records a normal audio Blob first; transcription happens only after a durable local draft exists.

const MIME_CANDIDATES = [
  "audio/mp4",
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/ogg;codecs=opus"
];

export function chooseAudioMime(MediaRecorderImpl = globalThis.MediaRecorder) {
  if (!MediaRecorderImpl) return "";
  for (const mime of MIME_CANDIDATES) {
    try {
      if (typeof MediaRecorderImpl.isTypeSupported !== "function" || MediaRecorderImpl.isTypeSupported(mime)) return mime;
    } catch (_) {
    }
  }
  return "";
}

export function createAudioRecorder({
  navigatorObj = globalThis.navigator,
  MediaRecorderImpl = globalThis.MediaRecorder,
  now = () => Date.now(),
  onChunk = null,
  timesliceMs = 2000
} = {}) {
  let recorder = null;
  let stream = null;
  let chunks = [];
  let startedAt = 0;

  function supported() {
    return !!(navigatorObj?.mediaDevices?.getUserMedia && MediaRecorderImpl);
  }

  async function start() {
    if (!supported()) throw new Error("audio_recording_unsupported");
    if (recorder && recorder.state !== "inactive") throw new Error("audio_already_recording");
    stream = await navigatorObj.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1
      }
    });
    chunks = [];
    const mimeType = chooseAudioMime(MediaRecorderImpl);
    try {
      recorder = mimeType ? new MediaRecorderImpl(stream, { mimeType, audioBitsPerSecond: 64000 }) : new MediaRecorderImpl(stream);
    } catch (_) {
      recorder = new MediaRecorderImpl(stream);
    }
    recorder.ondataavailable = (event) => {
      if (!event?.data?.size) return;
      chunks.push(event.data);
      try {
        onChunk?.(event.data, {
          chunkCount: chunks.length,
          mimeType: recorder?.mimeType || mimeType || event.data.type || "application/octet-stream",
          startedAt,
          durationMs: Math.max(0, now() - startedAt)
        });
      } catch (_) {
      }
    };
    startedAt = now();
    recorder.start(Math.max(500, Number(timesliceMs) || 2000));
    return { mimeType: recorder.mimeType || mimeType || "application/octet-stream", startedAt };
  }

  async function stop() {
    if (!recorder || recorder.state === "inactive") throw new Error("audio_not_recording");
    const current = recorder;
    try {
      return await new Promise((resolve, reject) => {
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
          } catch (e) {
            reject(e);
          }
        };
        try {
          current.requestData?.();
        } catch (_) {
        }
        try {
          current.stop();
        } catch (e) {
          reject(e);
        }
      });
    } finally {
      // Safari can surface a MediaRecorder error without a clean onstop path. Always release the
      // microphone tracks even when stop() rejects, otherwise iOS may keep the mic indicator alive.
      cleanup();
    }
  }

  function cleanup() {
    try {
      stream?.getTracks?.().forEach((track) => track.stop());
    } catch (_) {
    }
    recorder = null;
    stream = null;
    chunks = [];
    startedAt = 0;
  }

  function cancel() {
    try {
      if (recorder && recorder.state !== "inactive") recorder.stop();
    } catch (_) {
    }
    cleanup();
  }

  function isRecording() {
    return !!recorder && recorder.state === "recording";
  }

  return { supported, start, stop, cancel, isRecording };
}
