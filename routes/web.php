<?php

use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Notes\FolderController;
use App\Http\Controllers\Notes\NoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('users', UserController::class);
        Route::patch('users/{user}/verify', [UserController::class, 'verify'])->name('users.verify');
        Route::delete('bulk-users', [UserController::class, 'bulkDestroy'])->name('users.bulkDestroy');
    });

    Route::prefix('notes')->name('notes.')->group(function () {
        Route::get('/', [NoteController::class, 'index'])->name('index');

        Route::post('/', [NoteController::class, 'store'])->name('store');
        Route::put('/{note}', [NoteController::class, 'update'])->name('update');
        Route::delete('/{note}', [NoteController::class, 'destroy'])->name('destroy');  
        
        Route::delete('/bulk', [NoteController::class, 'bulkDestroy'])->name('bulkDestroy');

        Route::post('/folders', [FolderController::class, 'store'])->name('folders.store');
        Route::put('/folders/{folder}', [FolderController::class, 'update'])->name('folders.update');
        Route::delete('/folders/{folder}', [FolderController::class, 'destroy'])->name('folders.destroy');
    });
});

require __DIR__ . '/settings.php';
