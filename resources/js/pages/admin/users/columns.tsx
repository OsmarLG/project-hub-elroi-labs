"use client"

import * as React from "react"
import { usePage } from "@inertiajs/react"
import { router } from "@inertiajs/react"
import { toast } from "sonner"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface UserRow {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  email_verified_at: string | null
}

export const userColumns: ColumnDef<UserRow>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const rows = table.getRowModel().rows

      // Solo filas elegibles (no protegidas)
      const eligibleRows = rows.filter((row) => (row.original as any).id !== 1)

      const allEligibleSelected =
        eligibleRows.length > 0 && eligibleRows.every((row) => row.getIsSelected())

      const someEligibleSelected =
        eligibleRows.some((row) => row.getIsSelected())

      return (
        <Checkbox
          checked={
            allEligibleSelected || (someEligibleSelected && "indeterminate")
          }
          onCheckedChange={(value) => {
            const checked = !!value
            eligibleRows.forEach((row) => row.toggleSelected(checked))
          }}
          aria-label="Select all"
        />
      )
    },
    cell: ({ row }) => {
      const user = row.original as any
      const isProtected = user.id === 1

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          disabled={isProtected}
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="tabular-nums">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="lowercase truncate max-w-[360px]">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) => <div>{row.getValue("created_at")}</div>,
  },
  {
    accessorKey: "updated_at",
    header: "Updated At",
    cell: ({ row }) => <div>{row.getValue("updated_at")}</div>,
  },
  {
    accessorKey: "email_verified_at",
    header: "Verified",
    cell: ({ row }) => {
      const value = row.getValue<string | null>("email_verified_at")
      const verified = !!value

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex justify-center">
                {verified ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </TooltipTrigger>

            {verified && (
              <TooltipContent>
                <span>Verified at {new Date(value!).toLocaleString()}</span>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      )
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original
      const { auth } = usePage().props as any
      const currentUserId = auth?.user?.id

      const isProtected = user.id === 1 || user.id === currentUserId
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.email)}
            >
              Copy User Email
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.visit(`/admin/users/${user.id}`)}>
              View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.visit(`/admin/users/${user.id}/edit`)}>
              Edit
            </DropdownMenuItem>

            {!user.email_verified_at && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => {
                    router.patch(`/admin/users/${user.id}/verify`, {}, {
                      preserveScroll: true,
                      onSuccess: () => toast.success("User marked as verified."),
                      onError: () => toast.error("Failed to verify user."),
                    })
                  }}
                >
                  Mark as Verified
                </DropdownMenuItem>
              </>
            )}

            {!isProtected && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => {
                    if (!confirm(`Delete user #${user.id} (${user.email})?`)) return

                    router.delete(`/admin/users/${user.id}`, {
                      preserveScroll: true,
                      onSuccess: () => {
                        toast.success("User deleted successfully.")
                      },
                      onError: () => {
                        toast.error("Failed to delete user.")
                      }
                    })
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </>
            )}

          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
