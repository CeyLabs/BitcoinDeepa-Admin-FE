# BitcoinDeepa-Admin-FE

Admin dashboard for BitcoinDeepa DCA. Vite + React + shadcn/ui, React Router (data mode), TanStack Query, nuqs.

## Setup

```bash
bun install
cp .env.example .env   # VITE_API_URL = BitcoinDeepa-DCA-BE URL
bun run dev
```

Sign-in uses the backend's Better Auth (`/api/admin-auth`). Only admins can sign in; create one on the backend with `bun run admin:create --email <email> --name "<name>"`.

## Structure

```
src/
  app/          # providers, router, layouts, app-level pages
  features/     # one folder per feature: api/, components/, hooks/, pages/, index.ts
    auth/
    dashboard/
  components/   # shared: ui/ (shadcn), layout/ (sidebar, header), data-table/ (TanStack Table)
  hooks/ lib/   # shared hooks and helpers
```

Features import each other only through their `index.ts`.

## Tables

All tables use TanStack Table (v9) through `components/data-table`: `useDataTable` (server-side pagination), `DataTable`, `DataTablePagination` and `DataTableSearch`. Define columns per feature with `createColumnHelper<DataTableFeatures, Row>()` and keep filters/page in the URL with nuqs (see `features/members`).
