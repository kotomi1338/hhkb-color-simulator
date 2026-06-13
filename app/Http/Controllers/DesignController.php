<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDesignRequest;
use App\Models\Design;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DesignController extends Controller
{
    /**
     * Show the editor, optionally loading a saved design.
     */
    public function editor(Request $request): Response
    {
        $design = null;

        if ($id = $request->query('load')) {
            $design = Design::find($id);
        }

        return Inertia::render('editor', [
            'design' => $design,
        ]);
    }

    /**
     * List all saved designs.
     */
    public function index(): Response
    {
        $designs = Design::query()
            ->select('designs.*')
            ->leftJoin('presentation_slides', 'presentation_slides.design_id', '=', 'designs.id')
            ->orderByRaw('presentation_slides.sort_order is null')
            ->orderBy('presentation_slides.sort_order')
            ->orderBy('designs.created_at')
            ->get();

        return Inertia::render('history', [
            'designs' => $designs,
        ]);
    }

    /**
     * Store a newly created design.
     */
    public function store(StoreDesignRequest $request): RedirectResponse
    {
        Design::create($request->validated());

        return back();
    }

    /**
     * Delete a design (admins only).
     */
    public function destroy(Design $design): RedirectResponse
    {
        Gate::authorize('delete-designs');

        $design->delete();

        return back();
    }
}
