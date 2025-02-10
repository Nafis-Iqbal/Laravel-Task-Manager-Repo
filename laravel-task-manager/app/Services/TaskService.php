<?php

namespace App\Services;

use App\Models\Task;
use Carbon\Carbon;

class TaskService
{
    /**
     * Calculate the priority of a task based on its deadline and tags.
     *
     * @param Task $task
     * @return string
     */
    public function calculatePriority(Task $task): string
    {
        $deadline = Carbon::parse($task->created_at)->addDays(6);
        $now = Carbon::now();
        $daysLeft = $deadline->diffInDays($now, false);

        if ($daysLeft < 0) {
            return 'completed';
        }

        if ($task->priority == 'urgent') {
            return 'active';
        }

        if ($daysLeft <= 2) {
            return 'paused';
        }

        return 'cancelled';
    }

    /**
     * Check if the task is overdue.
     *
     * @param Task $task
     * @return bool
     */
    public function isOverdue(Task $task): bool
    {
        return Carbon::parse($task->deadline)->isPast();
    }
}
