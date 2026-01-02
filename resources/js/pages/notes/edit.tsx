"use client"

import * as React from "react"
import AppLayout from "@/layouts/app-layout"
import { Head, router, useForm } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import MDEditor from "@uiw/react-md-editor"

type Folder = { id: number; parent_id: number | null; name: string; children?: Folder[] }
type Note = { id: number; folder_id: number | null; title: string; content: string | null }

export default function NotesEdit({ note, folders }: { note: Note; folders: Folder[] }) {
  const form = useForm({
    title: note.title ?? "",
    content: note.content ?? "",
    folder_id: note.folder_id as number | null,
  })

  const flatFolders = (items: Folder[], out: Folder[] = []) => {
    for (const f of items) {
      out.push({ id: f.id, parent_id: f.parent_id, name: f.name })
      if (f.children?.length) flatFolders(f.children, out)
    }
    return out
  }

  const options = flatFolders(folders)

  return (
    <AppLayout>
      <Head title={`Edit note: ${note.title}`} />

      <div className="p-4 max-w-5xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Input
              className="w-[380px]"
              value={form.data.title}
              onChange={(e) => form.setData("title", e.target.value)}
              placeholder="Title"
            />

            <select
              className="h-10 rounded-md border bg-background px-3 text-sm"
              value={form.data.folder_id === null ? "" : String(form.data.folder_id)}
              onChange={(e) => {
                const v = e.target.value
                form.setData("folder_id", v === "" ? null : Number(v))
              }}
            >
              <option value="">Unfiled (no folder)</option>
              {options.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => form.put(`/notes/${note.id}`, { preserveScroll: true })}
              disabled={form.processing}
            >
              {form.processing ? "Saving..." : "Save"}
            </Button>

            <Button
              variant="destructive"
              onClick={() => {
                if (!confirm("Delete this note?")) return
                router.delete(`/notes/${note.id}`, { preserveScroll: true, onSuccess: () => router.visit("/notes") })
              }}
            >
              Delete
            </Button>

            <Button variant="outline" onClick={() => router.visit("/notes")}>
              Back
            </Button>
          </div>
        </div>

        <div data-color-mode="light" className="rounded-xl border p-3">
          <MDEditor
            value={form.data.content}
            onChange={(v) => form.setData("content", v ?? "")}
            height={520}
          />
        </div>
      </div>
    </AppLayout>
  )
}