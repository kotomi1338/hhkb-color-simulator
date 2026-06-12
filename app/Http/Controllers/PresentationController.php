<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReorderPresentationRequest;
use App\Http\Requests\UpdatePresentationSlideRequest;
use App\Models\Design;
use App\Models\PresentationSlide;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PresentationController extends Controller
{
    /**
     * Show the presentation management page.
     */
    public function index(): Response
    {
        $this->syncMissingSlides();

        return Inertia::render('presentation/index', [
            'slides' => $this->orderedSlides(),
        ]);
    }

    /**
     * Show the slideshow page.
     */
    public function slideshow(): Response
    {
        $this->syncMissingSlides();

        return Inertia::render('presentation/slideshow', [
            'slides' => $this->orderedSlides(),
        ]);
    }

    /**
     * Persist a new slide order.
     */
    public function reorder(ReorderPresentationRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            foreach ($request->validated('order') as $index => $id) {
                PresentationSlide::where('id', $id)->update(['sort_order' => $index]);
            }
        });

        return back();
    }

    /**
     * Update a slide's name and comment.
     */
    public function update(UpdatePresentationSlideRequest $request, PresentationSlide $slide): RedirectResponse
    {
        $slide->update($request->validated());

        return back();
    }

    /**
     * Create slides for any designs that don't have one yet, appended to the end.
     */
    private function syncMissingSlides(): void
    {
        $designsWithoutSlide = Design::query()
            ->whereDoesntHave('presentationSlide')
            ->oldest()
            ->get();

        if ($designsWithoutSlide->isEmpty()) {
            return;
        }

        $nextOrder = (int) PresentationSlide::max('sort_order') + 1;

        foreach ($designsWithoutSlide as $design) {
            PresentationSlide::create([
                'design_id' => $design->id,
                'sort_order' => $nextOrder++,
            ]);
        }
    }

    /**
     * Get all slides in display order with their designs.
     *
     * @return Collection<int, PresentationSlide>
     */
    private function orderedSlides(): Collection
    {
        return PresentationSlide::with('design')
            ->orderBy('sort_order')
            ->get();
    }
}
