<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Exception;
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
            'priority' => 'required|in:normal,urgent',
            'status' => 'required|in:active,completed,paused,cancelled',
        ]);

        $task = new Task([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]);

        $user = Auth::user();

        $task->status = $validatedData['status'];
        $task->priority = $validatedData['priority'];
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

            if ($task->user_id != Auth::id()) {
                return response()->json([
                    'message' => 'Unauthorised Access!',
                    'status' => 'failed',
                ], 201);
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

    public function getTasksByProject($projectId)
    {
        try {
            $project = Project::findOrFail($projectId);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found',
                'status' => 'failed'
            ], 200);
        }

        if ($project->user_id != Auth::id()) {
            return response()->json([
                'message' => 'Unauthorised Access!',
                'status' => 'failed',
            ], 201);
        }

        try {
            $tasksByProject = Task::where("project_id", $projectId)->get()->toArray();
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Tasks not found',
                'status' => 'failed'
            ], 200);
        }

        return response()->json([
            'message' => 'Task retrieved successfully',
            'status' => 'success',
            'data' => $tasksByProject
        ], 200);
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

    // Update tags of an existing task
    //Reference task tags using tag ids
    public function addTaskTag(Request $request)
    {
        $validatedData = $request->validate([
            'task_id' => 'required|numeric'
        ]);

        try {
            $task = Task::findOrFail($validatedData['task_id']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            try {
                $task->tags()->syncWithoutDetaching($request->input('task_tags'));
            } catch (Exception $e) {
                dd($e);
            }

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

    // Update tags of an existing task
    //Reference task tags using tag ids
    public function deleteTaskTag(Request $request)
    {
        $validatedData = $request->validate([
            'task_id' => 'required|numeric'
        ]);

        try {
            $task = Task::findOrFail($validatedData['task_id']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            try {
                $task->tags()->detach($request->input('task_tags'));
            } catch (Exception $e) {
                dd($e);
            }

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
            $tags = $task->tags;

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
