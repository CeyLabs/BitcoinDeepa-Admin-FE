import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { PAGE_SIZES } from "@/components/data-table"

import { KYC_STATUSES, SUBSCRIPTION_FILTERS } from "../api/members"

const filterParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsNumberLiteral(PAGE_SIZES).withDefault(20),
  kyc: parseAsStringLiteral(KYC_STATUSES),
  subscription: parseAsStringLiteral(SUBSCRIPTION_FILTERS),
  q: parseAsString,
}

/**
 * Members page filters, kept in the URL with a history entry per change
 * (searches replace the entry instead).
 */
export function useMemberFilters() {
  return useQueryStates(filterParsers, {
    clearOnDefault: true,
    history: "push",
  })
}
