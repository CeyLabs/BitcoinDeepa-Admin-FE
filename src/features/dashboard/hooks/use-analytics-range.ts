import { parseAsNumberLiteral, useQueryState } from "nuqs"

import { ANALYTICS_RANGES } from "../api/analytics"

/** Chart range in days, kept in the URL (?range=7|30|90). */
export function useAnalyticsRange() {
  return useQueryState(
    "range",
    parseAsNumberLiteral(ANALYTICS_RANGES).withDefault(30)
  )
}
