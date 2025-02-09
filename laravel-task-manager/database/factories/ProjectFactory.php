<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Task;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = ['active', 'completed', 'paused', 'cancelled'];

        return [
            'title' => fake()->word(),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement($statuses),
            'user_id' => User::factory(),
            'start_date' => $this->faker->dateTimeBetween('now'),
            'end_date' => $this->faker->dateTimeBetween('now', '+1 month'),
        ];
    }

    public function hasTasks()
    {
        return $this->has(Task::factory()->count(fake()->randomNumber()), 'tasks');
    }
}
