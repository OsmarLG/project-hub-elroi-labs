"use client"

import AppLayout from "@/layouts/app-layout"
import { Head, useForm } from "@inertiajs/react"
import { type BreadcrumbItem } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

const breadcrumbs: BreadcrumbItem[] = [
    { title: "Users", href: "/admin/users" },
    { title: "Create", href: "/admin/users/create" },
]

export default function Create() {
    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        mark_as_verified: false,
    })

    const submit = (e: React.FormEvent) => {
        e.preventDefault()
        form.post("/admin/users")
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users | Create" />

            <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-lg font-semibold">Create user</h1>
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

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
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
                            onChange={(e) => form.setData("password_confirmation", e.target.value)}
                            placeholder="********"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="mark_as_verified"
                            checked={form.data.mark_as_verified}
                            onCheckedChange={(checked) =>
                                form.setData("mark_as_verified", Boolean(checked))
                            }
                        />
                        <Label
                            htmlFor="mark_as_verified"
                            className="cursor-pointer select-none"
                        >
                            Mark as verified
                        </Label>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? "Saving..." : "Create"}
                        </Button>

                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}