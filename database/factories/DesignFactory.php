<?php

namespace Database\Factories;

use App\Models\Design;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Design>
 */
class DesignFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'layout_type' => 'US_HHKB',
            'colors' => [
                'key-0' => $this->faker->hexColor(),
                'key-1' => $this->faker->hexColor(),
            ],
        ];
    }
}
