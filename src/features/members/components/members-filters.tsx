import { XIcon } from "lucide-react"

import { DataTableSearch } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  KYC_STATUSES,
  type KycStatus,
  type SubscriptionFilter,
} from "../api/members"
import { useMemberFilters } from "../hooks/use-member-filters"
import { kycLabel } from "./members-columns"

const ALL = "all"
const kycItems: Record<string, string> = {
  [ALL]: "All KYC statuses",
  ...Object.fromEntries(KYC_STATUSES.map((s) => [s, kycLabel(s)])),
}
const subscriptionItems: Record<string, string> = {
  [ALL]: "Any subscription",
  active: "Active subscription",
  none: "No active subscription",
}

function FilterSelect({
  label,
  items,
  value,
  onChange,
  className,
}: {
  label: string
  items: Record<string, string>
  value: string | null
  onChange: (value: string | null) => void
  className?: string
}) {
  return (
    <Select
      items={items}
      value={value ?? ALL}
      onValueChange={(next) => onChange(next === ALL ? null : next)}
    >
      <SelectTrigger className={className} aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(items).map(([key, text]) => (
          <SelectItem key={key} value={key}>
            {text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function MembersFilters() {
  const [filters, setFilters] = useMemberFilters()
  const hasFilters = Boolean(filters.kyc || filters.subscription || filters.q)

  return (
    <div className="flex flex-wrap items-end gap-2">
      <DataTableSearch
        value={filters.q}
        onChange={(q) =>
          void setFilters({ q, page: null }, { history: "replace" })
        }
        placeholder="Telegram ID, name, email or phone"
        label="Search members"
      />
      <FilterSelect
        label="KYC status"
        items={kycItems}
        value={filters.kyc}
        onChange={(kyc) =>
          void setFilters({ kyc: kyc as KycStatus | null, page: null })
        }
        className="w-44"
      />
      <FilterSelect
        label="Subscription"
        items={subscriptionItems}
        value={filters.subscription}
        onChange={(subscription) =>
          void setFilters({
            subscription: subscription as SubscriptionFilter | null,
            page: null,
          })
        }
        className="w-52"
      />
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={() =>
            void setFilters({
              kyc: null,
              subscription: null,
              q: null,
              page: null,
            })
          }
        >
          <XIcon />
          Clear
        </Button>
      )}
    </div>
  )
}
