# MIND.EXE v5.4.4

## Decision Lab — psychological synthesis

- Added a new Gemini psychological synthesis to the final Decision Lab step.
- Existing “strongest logical argument” and “most emotional thought” remain unchanged.
- Logical LONG/SHORT (or FOR/AGAINST entry) balance is calculated deterministically from the user's own rated argument weights. Gemini cannot invent the percentage.
- Emotional balance is calculated separately from the user's own emotion-intensity ratings, so logical and emotional pull can visibly disagree.
- Neutral/uncertain argument weight is shown separately instead of being silently forced into one side.
- Gemini summarizes how each side exists in the user's reasoning, what is internally strong, what is weak/unstable, the central conflict, and one self-question.
- The psychology model receives no chart image, ticker/symbol, price feed or external market information.
- Prompt + response guard explicitly prohibit market validation, technical analysis, strategy correction, trade recommendations, confirmation advice, entries/exits/stops/targets or an AI-selected direction.
- Final clarity/confidence ratings are shown only after the synthesis succeeds or the user explicitly continues without it.
- The synthesis is fingerprinted against transcript/arguments/ratings/conditions; reasoning edits invalidate stale AI output.
- A completed synthesis is stored inside the Decision session and becomes part of the immutable pre-trade snapshot after lock.
- Locked Decision history now renders the saved psychological synthesis together with the original arguments.

## Verification

- Regression suite expanded to cover deterministic thought balance, chart/ticker exclusion, synthesis invalidation, immutable locking and final-flow ordering.
