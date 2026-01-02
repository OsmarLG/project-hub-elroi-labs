<?php

namespace App\Http\Controllers\Notes;

use App\Http\Controllers\Controller;
use App\Http\Requests\Notes\NoteStoreRequest;
use App\Http\Requests\Notes\NoteUpdateRequest;
use App\Http\Resources\Notes\FolderResource;
use App\Http\Resources\Notes\NoteResource;
use App\Models\Note;
use App\Services\Notes\NotesService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    public function __construct(protected NotesService $service) {}

    public function index(Request $request)
    {
        $filters = [
            'search' => $request->query('search'),
            'folder_id' => $request->query('folder_id'),
            'per_page' => $request->query('per_page', 10),
        ];

        $folders = $this->service->folderTree();
        $notes = $this->service->paginateNotes($filters);

        return Inertia::render('notes/index', [
            'folders' => FolderResource::collection($folders),
            'notes' => NoteResource::collection($notes),
            'filters' => [
                'search' => $filters['search'],
                'folder_id' => $filters['folder_id'],
            ],
        ]);
    }

    public function create(Request $request)
    {
        // opcional: preseleccionar folder
        return Inertia::render('notes/index', [
            'openCreate' => true,
            'presetFolderId' => $request->query('folder_id'),
        ]);
    }

    public function store(NoteStoreRequest $request)
    {
        $note = $this->service->createNote($request->validated());

        return redirect()
            ->route('notes.index', ['note' => $note->id, 'folder_id' => request('folder_id')])
            ->with('success', 'Note created.');
    }

    public function update(NoteUpdateRequest $request, Note $note)
    {
        $this->service->updateNote($note, $request->validated());
        return back()->with('success', 'Saved.');
    }

    public function destroy(Note $note)
    {
        $this->service->deleteNote($note);
        return back()->with('success', 'Deleted.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:notes,id',
        ]);

        $this->service->bulkDeleteNotes($request->input('ids'));

        return back()->with('success', 'Selected notes deleted.');
    }
}
