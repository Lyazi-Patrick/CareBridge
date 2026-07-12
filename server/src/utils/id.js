import { randomUUID } from "node:crypto";

/** Prefixed UUID so ids are self-describing in logs/DB browsing, e.g. "case_3f2a...". */
export function makeId(prefix) {
  return `${prefix}_${randomUUID()}`;
}
