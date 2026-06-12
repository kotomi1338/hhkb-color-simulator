<?php

namespace Database\Factories;

use App\Models\Design;
use App\Models\PresentationSlide;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PresentationSlide>
 */
class PresentationSlideFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'design_id' => Design::factory(),
            'name' => $this->faker->optional()->words(2, true),
            'comment' => $this->faker->optional()->sentence(),
            'sort_order' => 0,
        ];
    }
}
