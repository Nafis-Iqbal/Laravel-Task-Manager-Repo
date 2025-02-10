<?php

namespace Tests\Unit;

use App\Models\Task;
use App\Services\TaskService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class TaskServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TaskService $taskService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->taskService = new TaskService();
    }

    /** @test */
    public function it_returns_overdue_if_deadline_has_passed()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->subDays(1)->toDateString(),
        ]);
        $task->setRelation('tags', new Collection());

        $priority = $this->taskService->calculatePriority($task);
        $this->assertEquals('overdue', $priority);
    }

    /** @test */
    public function it_returns_high_if_task_has_urgent_tag()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->addDays(5)->toDateString(),
        ]);
        $task->setRelation('tags', collect([(object) ['name' => 'urgent']]));

        $priority = $this->taskService->calculatePriority($task);
        $this->assertEquals('high', $priority);
    }

    /** @test */
    public function it_returns_medium_if_deadline_is_within_two_days()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->addDays(1)->toDateString(),
        ]);
        $task->setRelation('tags', new Collection());

        $priority = $this->taskService->calculatePriority($task);
        $this->assertEquals('medium', $priority);
    }

    /** @test */
    public function it_returns_low_if_no_conditions_are_met()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->addDays(5)->toDateString(),
        ]);
        $task->setRelation('tags', new Collection());

        $priority = $this->taskService->calculatePriority($task);
        $this->assertEquals('low', $priority);
    }

    /** @test */
    public function it_correctly_checks_if_task_is_overdue()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->subDay()->toDateString(),
        ]);

        $this->assertTrue($this->taskService->isOverdue($task));
    }

    /** @test */
    public function it_correctly_checks_if_task_is_not_overdue()
    {
        $task = new Task([
            'updated_at' => Carbon::now()->addDay()->toDateString(),
        ]);

        $this->assertFalse($this->taskService->isOverdue($task));
    }
}
