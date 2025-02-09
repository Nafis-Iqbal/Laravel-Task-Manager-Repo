<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Project;
use App\Models\User;
use App\Models\Tag;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

    public function definition(): array
    {
        $statuses = ['started', 'paused', 'completed', 'canceled'];
        $priority = ['urgent', 'normal'];

        return [
            'title' => fake()->word(),
            'description' => fake()->sentence(10),
            'status' => fake()->randomElement($statuses),
            'priority' => fake()->randomElement($priority),
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
        ];
    }

    public function withTags()
    {
        return $this->has(Tag::factory()->count(fake()->randomNumber()), 'tags');
    }
}
