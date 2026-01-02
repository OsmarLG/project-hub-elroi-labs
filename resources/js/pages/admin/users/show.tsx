"use client"

import * as React from "react"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Head, Link } from "@inertiajs/react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type UserDTO = {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  created_at: string | null
  updated_at: string | null
}

export default function Show({ user }: { user: UserDTO }) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: "Users", href: "/admin/users" },
    { title: `#${user.id}`, href: `/admin/users/${user.id}` },
  ]

  const verified = !!user.email_verified_at

  const fmt = (value: string | null) =>
    value ? new Date(value).toLocaleString() : "—"

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Users | #${user.id}`} />

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">User #{user.id}</h1>
            <p className="text-sm text-muted-foreground">
              Details and status information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/admin/users/${user.id}/edit`}>
              <Button>Edit</Button>
            </Link>

            <Link href="/admin/users">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <CardTitle>Profile</CardTitle>

            {verified ? (
              <Badge>Verified</Badge>
            ) : (
              <Badge variant="destructive">Not verified</Badge>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{user.name}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Email</div>
              <div className="font-medium break-all">{user.email}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">Email verified at</div>
              <div className="font-medium">{fmt(user.email_verified_at)}</div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Created at</div>
                <div className="font-medium">{fmt(user.created_at)}</div>
              </div>

              <div className="grid gap-2">
                <div className="text-sm text-muted-foreground">Updated at</div>
                <div className="font-medium">{fmt(user.updated_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}