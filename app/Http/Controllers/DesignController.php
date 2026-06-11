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
        return Inertia::render('history', [
            'designs' => Design::latest()->get(),
        ]);
    }

    /**
     * Store a newly created design.
     */
    public function store(StoreDesignRequest $request): RedirectResponse
    {
        Design::create($request->validated());

        return to_route('history');
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
