import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { UserPlusIcon } from "lucide-react"

import { DataTable, useDataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { adminsQueryOptions } from "../api/admins"
import { adminColumns } from "../components/admins-columns"
import { AddAdminSheet } from "../components/add-admin-sheet"

export function AdminsPage() {
  const [adding, setAdding] = useState(false)
  const { data, isPending, isError, error } = useQuery(adminsQueryOptions())

  const table = useDataTable({
    data: data ?? [],
    columns: adminColumns,
    getRowId: (admin) => admin.id,
  })

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex justify-end">
        <Button onClick={() => setAdding(true)}>
          <UserPlusIcon />
          Add admin
        </Button>
      </div>
      <Card>
        <CardContent>
          {isPending ? (
            <Skeleton className="h-48 w-full" />
          ) : isError ? (
            <p className="text-sm text-destructive">
              Couldn&apos;t load admins: {error.message}
            </p>
          ) : (
            <DataTable table={table} emptyMessage="No admins" />
          )}
        </CardContent>
      </Card>
      <AddAdminSheet open={adding} onOpenChange={setAdding} />
    </div>
  )
}
