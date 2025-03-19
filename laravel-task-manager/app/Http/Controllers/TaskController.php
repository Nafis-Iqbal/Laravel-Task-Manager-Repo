<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Exception;
use Illuminate\Contracts\Support\ValidatedData;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // Create a new task in the database
    public function createTask(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|min:4|max:20',
            'description' => 'required|max:100',
            'priority' => 'required|in:normal,urgent',
            'status' => 'required|in:active,completed,paused,cancelled',
            'end_date' => 'required|date',
            'project_id' => 'nullable|numeric'
        ]);

        $user = Auth::user();

        if($validatedData['project_id'] == 0)
        {
            $projectCount = $user->projects->count();

            if($projectCount < 1)
            {
                $project = new Project([
                    'title' => 'Project 1',
                    'description' => 'New instant project.'
                ]);
        
                $project->user_id = $user->id;
                $project->status = 'active';
                $project->progress = 0;
                $project->end_date = $request->end_Date;
        
                $project->save();

                $validatedData['project_id'] = $project->id;
            }
        }

        /** @var \App\Models\User $user **/
        $taskTitleExists = $user->tasks()->where('tasks.title', $validatedData['title'])->exists();

        if($taskTitleExists)
        {
            return response()->json([
                'message' => 'Task creation failed. User already has a task with the same title.',
                'status' => 'failed',
                'data' => [] 
            ]);
        }

        $task = new Task([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
        ]);

        $task->status = $validatedData['status'];
        $task->priority = $validatedData['priority'];
        $task->project_id = $validatedData['project_id'];
        $task->end_date = $validatedData['end_date'];
        $task->user_id = $user->id; // Assign the task to the logged-in user

        try {
            $task->save();
            return response()->json([
                'message' => 'Task created successfully',
                'status' => 'success',
                'data' => $task
            ]);
        } catch (QueryException $q) {
            return response()->json([
                'message' => 'Task creation failed. Check if parent project exists',
                'error' => $q->getMessage(),
                'status' => 'failed',
                'data' => [] 
            ]);
        }
    }

    public function getTasks($id = null)
    {
        if ($id) {
            try {
                $task = Task::findOrFail($id);
                $task->project_title = $task->project->title;
                unset($task->project);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Task not found',
                    'status' => 'failed',
                    'data' => [] 
                ], 200);
            }

            if ($task->user_id != Auth::id()) {
                return response()->json([
                    'message' => 'Unauthorised Access!',
                    'status' => 'failed',
                    'data' => [] 
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
                'status' => 'failed',
                'data' => [] 
            ], 200);
        }

        if ($project->user_id != Auth::id()) {
            return response()->json([
                'message' => 'Unauthorised Access!',
                'status' => 'failed',
                'data' => [] 
            ], 201);
        }

        try {
            $tasksByProject = Task::where("project_id", $projectId)->get()->toArray();
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Tasks not found',
                'status' => 'failed',
                'data' => [] 
            ], 200);
        }

        return response()->json([
            'message' => 'Task retrieved successfully',
            'status' => 'success',
            'data' => $tasksByProject
        ], 200);
    }

    // Update an existing task
    public function updateTask(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status' => 'required|in:active,completed,paused,cancelled',
            'priority' => 'required|in:normal,urgent',
            'id' => 'required|numeric'
        ]);

        try {
            $task = Task::findOrFail($validatedData['id']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Task not found!',
                'status' => 'failed',
                'data' => [] 
            ], 200);
        }

        $user = Auth::user();

        /** @var \App\Models\User $user **/
        $taskTitleExists = $user->tasks()
        ->where('tasks.title', $validatedData['title'])
        ->where('tasks.id', '!=', $validatedData['id'])
        ->exists();

        if($taskTitleExists)
        {
            return response()->json([
                'message' => 'Task update failed. User already has a task with the target title.',
                'status' => 'failed',
                'data' => [] 
            ]);
        }

        if ($task->user_id == Auth::id()) {
            $task->update([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
            ]);

            $task->status = $validatedData['status'];
            $task->priority = $validatedData['priority'];
            $task->save();

            if($request->has('status') && $request->input('status') == "completed"){
                $taskParentProject = $task->project;
                $parentProjectTasks = $taskParentProject->tasks;

                $completedTaskCount = $parentProjectTasks->where("status", "completed")->count();

                $parentProjectProgress = intval(($completedTaskCount/$parentProjectTasks->count()) * 100); 
                $taskParentProject->progress = $parentProjectProgress;

                if($parentProjectProgress > 99)
                {
                    $taskParentProject->status = "completed";
                }

                $taskParentProject->save();
            }

            return response()->json([
                'message' => 'Task updated successfully',
                'status' => 'success',
                'data' => $task
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
                'data' => [] 
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
                'data' => [] 
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
                'message' => 'Task tags updated successfully',
                'status' => 'success',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
                'data' => [] 
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
                'data' => [] 
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
                'message' => 'Task tags updated successfully',
                'status' => 'success',
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
                'data' => [] 
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
                'data' => [] 
            ], 200);
        }

        if ($task->user_id == Auth::id()) {
            $tags = $task->tags;

            return response()->json([
                'message' => 'Task tags retrieved successfully',
                'status' => 'success',
                'data' => $tags
            ], 200);
        } else {
            return response()->json([
                'message' => 'Unauthorized access!',
                'status' => 'failed',
                'data' => [] 
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
                'data' => [] 
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
                'data' => [] 
            ], 200);
        }
    }
}
