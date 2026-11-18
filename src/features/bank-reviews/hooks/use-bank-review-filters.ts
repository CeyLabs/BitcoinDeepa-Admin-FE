import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { PAGE_SIZES } from "@/components/data-table"

import { BANK_REVIEW_STATUSES } from "../api/bank-reviews"

const filterParsers = {
  status:
    parseAsStringLiteral(BANK_REVIEW_STATUSES).withDefault("PENDING_REVIEW"),
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsNumberLiteral(PAGE_SIZES).withDefault(20),
  q: parseAsString,
  /** Account open in the review sheet */
  review: parseAsString,
}

/**
 * Bank reviews page state, kept in the URL with a history entry per change
 * (searches replace the entry instead).
 */
export function useBankReviewFilters() {
  return useQueryStates(filterParsers, {
    clearOnDefault: true,
    history: "push",
  })
}
