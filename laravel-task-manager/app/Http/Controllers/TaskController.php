<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // Create a new task in the database
    public function createTask(Request $request, $projectId)
    {
        $validatedData = $request->validate([
            'title' => 'required|min:4|max:20',
            'description' => 'required|max:100',
            'status' => 'required|in:active,completed,paused,cancelled',
        ]);

        $task = new Task([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]);

        $user = Auth::user();

        $task->status = $validatedData['status'];
        $task->project_id = $projectId;
        $task->user_id = $user->id; // Assign the task to the logged-in user

        try {
            $task->save();
            return response()->json([
                'message' => 'Task created successfully',
                'status' => 'success'
            ]);
        } catch (QueryException $q) {
            return response()->json([
                'message' => 'Task creation failed. Check if parent project exists',
                'error' => $q->getMessage(),
                'status' => 'failed'
            ]);
        }
    }

    public function getTasks($id = null)
    {
        if ($id) {
            try {
                $task = Task::findOrFail($id);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Task not found',
                    'status' => 'failed'
                ], 200);
            }

            return response()->json([
                'message' => 'Task retrieved successfully',
                'status' => 'success',
                'data' => $task
            ], 200);
        } else {
            $user = Auth::user();
            $tasks = $user->tasks;

            return response()->json([
                'message' => 'Tasks retrieved successfully',
                'status' => 'success',
                'data' => $tasks
            ], 200);
        }
    }

    // Update an existing task
    public function updateTask(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status' => 'required|in:active,completed,paused,cancelled',
        ]);

        try {
            $task = Task::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            $task->update([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
            ]);

            $task->status = $validatedData['status'];
            $task->save();

            return response()->json([
                'message' => 'Task updated successfully',
                'status' => 'success',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
            ], 200);
        }
    }

    // Update an existing task
    public function updateTaskTag(Request $request, $id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            $task->tags()->syncWithoutDetaching($request->input('tags'));

            $task->save();

            return response()->json([
                'message' => 'Task updated successfully',
                'status' => 'success',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
            ], 200);
        }
    }

    public function getTaskTags($id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            $tags = $task->tags->pluck('title');

            return response()->json([
                'message' => 'Tags retrieved successfully',
                'status' => 'success',
                'data' => $tags
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
            ], 200);
        }
    }

    // Delete a task
    public function deleteTask($id)
    {
        try {
            $task = Task::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found.',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            $task->delete();

            return response()->json([
                'message' => 'Task deleted successfully',
                'status' => 'success',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
            ], 200);
        }
    }
}
