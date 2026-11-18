import {
  parseAsInteger,
  parseAsNumberLiteral,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"

import { PAGE_SIZES, TRANSACTION_STATUSES } from "../api/transactions"

const filterParsers = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsNumberLiteral(PAGE_SIZES).withDefault(20),
  status: parseAsStringLiteral(TRANSACTION_STATUSES),
  from: parseAsString,
  to: parseAsString,
  q: parseAsString,
}

/**
 * Transactions page filters, kept in the URL (?page=2&status=FAILED...).
 * Each change is a history entry, so Back returns to the previous page/filters.
 */
export function useTransactionFilters() {
  return useQueryStates(filterParsers, {
    clearOnDefault: true,
    history: "push",
  })
}
