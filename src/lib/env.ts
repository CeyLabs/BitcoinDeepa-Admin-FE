export const env = {
  /** BitcoinDeepa DCA backend, e.g. https://api.example.com */
  apiUrl: (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(
    /\/$/,
    ""
  ),
}
