<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Design;
use App\Models\PresentationSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PresentationTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => UserRole::Admin]);
    }

    public function test_guests_cannot_access_the_presentation_page(): void
    {
        $this->get(route('presentation.index'))->assertRedirect(route('login'));
    }

    public function test_general_users_cannot_access_the_presentation_page(): void
    {
        $user = User::factory()->create(['role' => UserRole::General]);

        $this->actingAs($user)->get(route('presentation.index'))->assertForbidden();
    }

    public function test_admins_can_view_the_presentation_page(): void
    {
        Design::factory()->count(3)->create();

        $response = $this->actingAs($this->admin())->get(route('presentation.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('presentation/index')
            ->has('slides', 3)
        );
    }

    public function test_index_creates_slides_for_designs_without_one(): void
    {
        $designs = Design::factory()->count(2)->create();

        $this->actingAs($this->admin())->get(route('presentation.index'))->assertOk();

        $this->assertDatabaseCount('presentation_slides', 2);
        foreach ($designs as $design) {
            $this->assertDatabaseHas('presentation_slides', ['design_id' => $design->id]);
        }
    }

    public function test_index_does_not_duplicate_existing_slides(): void
    {
        $design = Design::factory()->create();
        PresentationSlide::factory()->create(['design_id' => $design->id]);

        $this->actingAs($this->admin())->get(route('presentation.index'))->assertOk();

        $this->assertDatabaseCount('presentation_slides', 1);
    }

    public function test_slideshow_page_renders_ordered_slides(): void
    {
        Design::factory()->count(2)->create();

        $response = $this->actingAs($this->admin())->get(route('presentation.slideshow'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('presentation/slideshow')
            ->has('slides', 2)
        );
    }

    public function test_admin_can_reorder_slides(): void
    {
        $first = PresentationSlide::factory()->create(['sort_order' => 0]);
        $second = PresentationSlide::factory()->create(['sort_order' => 1]);

        $this->actingAs($this->admin())
            ->patch(route('presentation.reorder'), ['order' => [$second->id, $first->id]])
            ->assertRedirect();

        $this->assertSame(0, $second->refresh()->sort_order);
        $this->assertSame(1, $first->refresh()->sort_order);
    }

    public function test_admin_can_update_name_and_comment_preserving_newlines(): void
    {
        $slide = PresentationSlide::factory()->create();

        $this->actingAs($this->admin())
            ->patch(route('presentation.slides.update', $slide), [
                'name' => 'My Design',
                'comment' => "line one\nline two",
            ])
            ->assertRedirect();

        $slide->refresh();
        $this->assertSame('My Design', $slide->name);
        $this->assertSame("line one\nline two", $slide->comment);
    }

    public function test_general_users_cannot_update_a_slide(): void
    {
        $slide = PresentationSlide::factory()->create();
        $user = User::factory()->create(['role' => UserRole::General]);

        $this->actingAs($user)
            ->patch(route('presentation.slides.update', $slide), ['name' => 'Nope'])
            ->assertForbidden();
    }
}
