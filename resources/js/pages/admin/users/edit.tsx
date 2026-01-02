"use client"

import * as React from "react"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Head, router, useForm, Link } from "@inertiajs/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type UserDTO = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
}

export default function Edit({ user }: { user: UserDTO }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Users", href: "/admin/users" },
    { title: `#${user.id}`, href: `/admin/users/${user.id}` },
    { title: "Edit", href: `/admin/users/${user.id}/edit` },
  ]

  const form = useForm({
    name: user.name ?? "",
    email: user.email ?? "",
    password: "",
    password_confirmation: "",
    mark_as_verified: !!user.email_verified_at,
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()

    form.put(`/admin/users/${user.id}`, {
      preserveScroll: true,
      onSuccess: () => toast.success("User updated successfully."),
      onError: () => toast.error("Failed to update user."),
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Users | Edit #${user.id}`} />

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold">Edit user</h1>
            <p className="text-sm text-muted-foreground">
              Update profile details. Password is optional.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/admin/users/${user.id}`}>
              <Button variant="outline">View</Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.data.name}
              onChange={(e) => form.setData("name", e.target.value)}
              placeholder="John Doe"
            />
            {form.errors.name && (
              <p className="text-sm text-destructive">{form.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.data.email}
              onChange={(e) => form.setData("email", e.target.value)}
              placeholder="john@example.com"
            />
            {form.errors.email && (
              <p className="text-sm text-destructive">{form.errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="password">New password (optional)</Label>
              <Input
                id="password"
                type="password"
                value={form.data.password}
                onChange={(e) => form.setData("password", e.target.value)}
                placeholder="********"
              />
              {form.errors.password && (
                <p className="text-sm text-destructive">{form.errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={form.data.password_confirmation}
                onChange={(e) =>
                  form.setData("password_confirmation", e.target.value)
                }
                placeholder="********"
              />
            </div>
          </div>

          {/* Mark as verified */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mark_as_verified"
              checked={form.data.mark_as_verified}
              onCheckedChange={(checked) =>
                form.setData("mark_as_verified", Boolean(checked))
              }
            />
            <Label htmlFor="mark_as_verified" className="cursor-pointer select-none">
              Mark as verified
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={form.processing}>
              {form.processing ? "Saving..." : "Save changes"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit(`/admin/users/${user.id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}