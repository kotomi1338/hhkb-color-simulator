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

    public function test_it_creates_a_new_admin_user_from_options(): void
    {
        $this->artisan('app:make-admin', [
            'email' => 'new@example.com',
            '--name' => 'New Admin',
            '--password' => 'password-123',
        ])->assertSuccessful();

        $user = User::where('email', 'new@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame(UserRole::Admin, $user->role);
        $this->assertNotNull($user->email_verified_at);
    }

    public function test_it_fails_to_create_without_name_and_password_when_non_interactive(): void
    {
        $this->artisan('app:make-admin', ['email' => 'missing@example.com', '--no-interaction' => true])
            ->assertFailed();

        $this->assertDatabaseMissing('users', ['email' => 'missing@example.com']);
    }
}
