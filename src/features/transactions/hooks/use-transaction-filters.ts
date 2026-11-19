import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { PAGE_SIZES } from "@/components/data-table"

import { TRANSACTION_KINDS, TRANSACTION_STATUSES } from "../api/transactions"

const filterParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsNumberLiteral(PAGE_SIZES).withDefault(20),
  status: parseAsStringLiteral(TRANSACTION_STATUSES),
  kind: parseAsStringLiteral(TRANSACTION_KINDS),
  from: parseAsString,
  to: parseAsString,
  q: parseAsString,
}

/**
 * Transactions page filters, kept in the URL (?page=2&status=FAILED...).
 * Each page or filter change is a history entry, so Back returns to it; typing
 * a search replaces the entry instead of adding one per pause.
 */
export function useTransactionFilters() {
  return useQueryStates(filterParsers, {
    clearOnDefault: true,
    history: "push",
  })
}
