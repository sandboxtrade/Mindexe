# MIND.EXE v5.4.2

- Replaced the native Decision Lab delete confirmation with the shared MIND.EXE styled confirmation modal.
- Restored one chart screenshot attachment per Decision session.
- Decision screenshots use a dedicated high-detail compressor and separate Firestore media document.
- Unsynced Decision screenshots are recoverable from IndexedDB on the same device.
- Attached screenshots are optional Gemini visual context and cannot create arguments by themselves.
- Screenshot presence is part of the locked pre-trade snapshot and cannot be changed after lock.
- Decision media is included in full backup/restore, full reset, and atomic Decision deletion.
