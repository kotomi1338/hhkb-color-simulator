<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Design;
use App\Models\PresentationSlide;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DesignTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_store_a_design(): void
    {
        $response = $this->from(route('home'))->post(route('designs.store'), [
            'layout_type' => 'US_HHKB',
            'colors' => ['key-0' => '#FFFFFF', 'key-1' => '#000000'],
        ]);

        $response->assertRedirect(route('home'));
        $this->assertDatabaseCount('designs', 1);
    }

    public function test_index_lists_designs(): void
    {
        Design::factory()->count(3)->create();

        $response = $this->get(route('history'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('history')
            ->has('designs', 3)
        );
    }

    public function test_index_orders_designs_by_presentation_order(): void
    {
        $first = Design::factory()->create();
        $second = Design::factory()->create();
        $withoutSlide = Design::factory()->create();

        PresentationSlide::factory()->create(['design_id' => $second->id, 'sort_order' => 0]);
        PresentationSlide::factory()->create(['design_id' => $first->id, 'sort_order' => 1]);

        $response = $this->get(route('history'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('history')
            ->where('designs.0.id', $second->id)
            ->where('designs.1.id', $first->id)
            ->where('designs.2.id', $withoutSlide->id)
        );
    }

    public function test_guests_cannot_delete_a_design(): void
    {
        $design = Design::factory()->create();

        $this->delete(route('designs.destroy', $design))->assertRedirect(route('login'));

        $this->assertDatabaseHas('designs', ['id' => $design->id]);
    }

    public function test_general_users_cannot_delete_a_design(): void
    {
        $design = Design::factory()->create();
        $user = User::factory()->create(['role' => UserRole::General]);

        $this->actingAs($user)->delete(route('designs.destroy', $design))->assertForbidden();

        $this->assertDatabaseHas('designs', ['id' => $design->id]);
    }

    public function test_admins_can_delete_a_design(): void
    {
        $design = Design::factory()->create();
        $admin = User::factory()->create(['role' => UserRole::Admin]);

        $this->actingAs($admin)->delete(route('designs.destroy', $design))->assertRedirect();

        $this->assertDatabaseMissing('designs', ['id' => $design->id]);
    }
}
