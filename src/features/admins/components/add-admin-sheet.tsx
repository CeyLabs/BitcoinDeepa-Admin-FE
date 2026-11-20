import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { MIN_ADMIN_PASSWORD_LENGTH, useCreateAdmin } from "../api/admins"

/** Add another admin: they sign in with this email and password. */
export function AddAdminSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const create = useCreateAdmin()

  const close = () => {
    create.reset()
    onOpenChange(false)
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    create.mutate(
      {
        name: String(form.get("name")),
        email: String(form.get("email")),
        password: String(form.get("password")),
      },
      {
        onSuccess: (admin) => {
          toast.success(`${admin.email} can now sign in`)
          close()
        },
      }
    )
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => (next ? onOpenChange(true) : close())}
    >
      <SheetContent className="w-full sm:max-w-md">
        <form onSubmit={onSubmit} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>Add admin</SheetTitle>
            <SheetDescription>
              They get full access to this dashboard. Share the password with
              them securely.
            </SheetDescription>
          </SheetHeader>
          <FieldGroup className="flex-1 px-4">
            <Field>
              <FieldLabel htmlFor="admin-name">Name</FieldLabel>
              <Input id="admin-name" name="name" maxLength={100} required />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <Input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="off"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-password">Password</FieldLabel>
              <Input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="new-password"
                minLength={MIN_ADMIN_PASSWORD_LENGTH}
                maxLength={128}
                required
              />
              <FieldDescription>
                At least {MIN_ADMIN_PASSWORD_LENGTH} characters
              </FieldDescription>
            </Field>
            {create.error && <FieldError>{create.error.message}</FieldError>}
          </FieldGroup>
          <SheetFooter className="flex-row justify-end border-t">
            <Button
              type="button"
              variant="outline"
              disabled={create.isPending}
              onClick={close}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Adding…" : "Add admin"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
