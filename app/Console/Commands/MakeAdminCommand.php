<?php

namespace App\Console\Commands;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

use function Laravel\Prompts\password;
use function Laravel\Prompts\text;

#[Signature('app:make-admin {email} {--name=} {--password=}')]
#[Description('Promote a user to admin, creating the account if it does not exist')]
class MakeAdminCommand extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $email = $this->argument('email');

        $user = User::where('email', $email)->first();

        if ($user) {
            $user->role = UserRole::Admin;
            $user->save();

            $this->info("Existing user [{$email}] promoted to admin.");

            return self::SUCCESS;
        }

        $name = $this->option('name');
        $plainPassword = $this->option('password');

        if ($this->input->isInteractive()) {
            $name ??= text('Name for the new admin', required: true);
            $plainPassword ??= password('Password for the new admin', required: true);
        }

        if (! $name || ! $plainPassword) {
            $this->error('User does not exist. Provide --name and --password to create the admin (required when running non-interactively).');

            return self::FAILURE;
        }

        $user = new User;
        $user->name = $name;
        $user->email = $email;
        $user->password = Hash::make($plainPassword);
        $user->email_verified_at = now();
        $user->role = UserRole::Admin;
        $user->save();

        $this->info("Admin user [{$email}] created.");

        return self::SUCCESS;
    }
}
