<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MakeAdminCommandTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_promotes_an_existing_user_to_admin(): void
    {
        $user = User::factory()->create([
            'email' => 'existing@example.com',
            'role' => UserRole::General,
        ]);

        $this->artisan('app:make-admin', ['email' => 'existing@example.com'])
            ->assertSuccessful();

        $this->assertSame(UserRole::Admin, $user->fresh()->role);
    }

    public function test_it_creates_a_new_admin_user_when_none_exists(): void
    {
        $this->artisan('app:make-admin', ['email' => 'new@example.com'])
            ->expectsQuestion('Name for the new admin', 'New Admin')
            ->expectsQuestion('Password for the new admin', 'password-123')
            ->assertSuccessful();

        $user = User::where('email', 'new@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertNotNull($user->email_verified_at);
    }
}
