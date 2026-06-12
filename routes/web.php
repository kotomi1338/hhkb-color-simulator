<?php

use App\Http\Controllers\DesignController;
use App\Http\Controllers\PresentationController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DesignController::class, 'editor'])->name('home');

Route::get('/history', [DesignController::class, 'index'])->name('history');

Route::post('/designs', [DesignController::class, 'store'])->name('designs.store');

Route::middleware('auth')->group(function () {
    Route::delete('/designs/{design}', [DesignController::class, 'destroy'])->name('designs.destroy');
});

Route::middleware(['auth', 'can:manage-presentation'])->group(function () {
    Route::get('/presentation', [PresentationController::class, 'index'])->name('presentation.index');
    Route::get('/presentation/slideshow', [PresentationController::class, 'slideshow'])->name('presentation.slideshow');
    Route::patch('/presentation/reorder', [PresentationController::class, 'reorder'])->name('presentation.reorder');
    Route::patch('/presentation/slides/{slide}', [PresentationController::class, 'update'])->name('presentation.slides.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
