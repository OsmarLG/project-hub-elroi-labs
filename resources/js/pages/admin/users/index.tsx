"use client"

import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import * as React from "react"

import { Input } from "@/components/ui/input"
import { DataTable } from "@/components/data-table/data-table"
import { InertiaPagination } from "@/components/data-table/inertia-pagination"

import { userColumns, type UserRow } from "./columns"
import type { SortingState } from "@tanstack/react-table"

import { Link } from "@inertiajs/react"
import { Button } from "@/components/ui/button"

import { toast } from "sonner"

const breadcrumbs: BreadcrumbItem[] = [{ title: "Users", href: "/admin/users" }]

interface PaginatedUsers<T> {
    data: T[]
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
    meta: {
        current_page: number
        from: number | null
        last_page: number
        links: { url: string | null; label: string; active: boolean; page: number | null }[]
        per_page: number
        to: number | null
        total: number
    }
}

export default function Index({
    users,
    allUsersCount,
    filters,
}: {
    users: PaginatedUsers<UserRow>
    allUsersCount: number
    filters: { search?: string; sort?: string; dir?: "asc" | "desc" }
}) {
    const [search, setSearch] = React.useState(filters?.search ?? "")

    const [sorting, setSorting] = React.useState<SortingState>(() => {
        const sort = filters?.sort ?? "id"
        const dir = filters?.dir ?? "desc"
        return sort ? [{ id: sort, desc: dir === "desc" }] : []
    })

    // sort server-side
    React.useEffect(() => {
        const s = sorting?.[0]
        const sort = s?.id ?? "id"
        const dir = s ? (s.desc ? "desc" : "asc") : "desc"

        router.get(
            "/admin/users",
            { search, sort, dir, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorting])

    // search server-side (debounce)
    React.useEffect(() => {
        const t = setTimeout(() => {
            const s = sorting?.[0]
            const sort = s?.id ?? (filters?.sort ?? "id")
            const dir = s ? (s.desc ? "desc" : "asc") : (filters?.dir ?? "desc")

            router.get(
                "/admin/users",
                { search, sort, dir, page: 1 },
                { preserveState: true, preserveScroll: true, replace: true }
            )
        }, 300)

        return () => clearTimeout(t)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    const from = users.meta.from ?? 0
    const to = users.meta.to ?? 0

    const [selectedIds, setSelectedIds] = React.useState<number[]>([])

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users | List" />

            <div className="flex items-center justify-between gap-4 p-4">
                <div>
                    <h1 className="text-lg font-semibold">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Mostrando {from}–{to} de {users.meta.total} (Total sistema: {allUsersCount})
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-full max-w-sm">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nombre o email..."
                        />
                    </div>

                    {selectedIds.length > 0 && (
                        <Button
                            variant="destructive"
                            disabled={selectedIds.length === 0}
                            onClick={() => {
                                if (!confirm(`Delete ${selectedIds.length} user(s)?`)) return

                                router.delete("/admin/bulk-users", {
                                    data: { ids: selectedIds },
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        toast.success("Users deleted successfully.")
                                        setSelectedIds([])
                                    },
                                    onError: () => toast.error("Could not delete users."),
                                })
                            }}
                        >
                            Delete selected ({selectedIds.length})
                        </Button>
                    )}

                    <Link href="/admin/users/create">
                        <Button>Create user</Button>
                    </Link>
                </div>
            </div>

            <div className="p-4">
                <DataTable
                    columns={userColumns}
                    data={users.data}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    sortableColumns={["id", "name", "email", "created_at", "updated_at"]}
                    onSelectionChange={setSelectedIds}
                />

                <InertiaPagination
                    metaLinks={users.meta.links}
                    prevUrl={users.links.prev}
                    nextUrl={users.links.next}
                />
            </div>
        </AppLayout>
    )
}
