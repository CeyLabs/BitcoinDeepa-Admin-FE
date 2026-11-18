const lkr = new Intl.NumberFormat("en-LK", {
  style: "currency",
  currency: "LKR",
  maximumFractionDigits: 0,
})
const integer = new Intl.NumberFormat("en-US")

export const formatLkr = (value: number) => lkr.format(value)
export const formatNumber = (value: number) => integer.format(value)

/** 12,345,678 sats -> "0.12345678 BTC" */
export const formatBtc = (sats: number) => `${(sats / 1e8).toFixed(8)} BTC`

/** Sri Lanka time, like the date filters and the daily chart */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    timeZone: "Asia/Colombo",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

/** "2026-11-18" -> "18 Nov" (the date is already a calendar day) */
export const formatDay = (day: string) =>
  new Date(`${day}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })
