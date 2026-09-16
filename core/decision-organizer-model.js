// Pure validation for Decision Lab AI structuring output.
// Kept outside Firebase so regression tests can validate AI boundaries without runtime SDKs.

import { normalizeDecisionFactor } from "./decision-factor-taxonomy.js";
import { allowedDecisionSides } from "./decision-model.js";

export function validateDecisionOrganizerResponse(raw, mode = "direction", source = "voice") {
  const rows = Array.isArray(raw?.arguments) ? raw.arguments : [];
  const allowedSides = allowedDecisionSides(mode);
  const out = [];
  for (const row of rows.slice(0, 14)) {
    const rawText = String(row?.rawText || row?.normalizedText || "").trim().slice(0, 500);
    const normalizedText = String(row?.normalizedText || row?.rawText || "").trim().slice(0, 500);
    if (!rawText || !normalizedText) continue;
    const side = allowedSides.includes(row?.side) ? row.side : "neutral";
    const factor = normalizeDecisionFactor(row?.factorGroup, row?.factorId);
    out.push({
      rawText,
      normalizedText,
      side,
      factorGroup: factor.factorGroup,
      factorId: factor.factorId,
      factorLabel: row?.factorLabel ? String(row.factorLabel).trim().slice(0, 120) : null,
      weight: null,
      weightRated: false,
      emotionIntensity: null,
      emotionRated: false,
      emotionTag: null,
      isDecisive: false,
      source,
      aiGeneratedStructure: true,
      userEdited: false
    });
  }
  if (!out.length) throw new Error("decision_organizer_empty");
  return out;
}
