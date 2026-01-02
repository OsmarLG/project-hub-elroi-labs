"use client"

import AppLayout from "@/layouts/app-layout"
import { Head, router, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NotesCreate() {
  const form = useForm({ title: "Untitled", content: "", folder_id: null as number | null })

  return (
    <AppLayout>
      <Head title="Create note" />

      <div className="p-4 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Create note</div>
        </div>

        <div className="space-y-3">
          <Input value={form.data.title} onChange={(e) => form.setData("title", e.target.value)} />

          <div className="flex gap-2">
            <Button
              onClick={() => {
                form.post("/notes", { preserveScroll: true })
              }}
              disabled={form.processing}
            >
              {form.processing ? "Creating..." : "Create"}
            </Button>

            <Button variant="outline" onClick={() => router.visit("/notes")}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}