<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    // Constructor to ensure the user is authenticated for CRUD actions
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Display a list of tasks
    public function index()
    {
        // Fetch all tasks that belong to the authenticated user
        $tasks = Auth::user()->tasks; // Assuming there's a relation defined on User model
        return view('tasks.index', compact('tasks')); // Blade view for listing tasks
    }

    public function getTasks() {}

    // Show the form to create a new task
    public function createTask()
    {
        return view('tasks.create'); // Blade view for creating a new task
    }

    // Update an existing task
    public function updateTask(Request $request, Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return redirect()->route('tasks.index')->with('error', 'Unauthorized access.');
        }

        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status' => 'required|in:pending,in-progress,completed',
        ]);

        $task->update([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
        ]);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    // Delete a task
    public function deleteTask(Task $task)
    {
        if ($task->user_id !== Auth::id()) {
            return redirect()->route('tasks.index')->with('error', 'Unauthorized access.');
        }

        $task->delete();
        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }

    // Store a new task in the database
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|max:255',
            'description' => 'required',
            'status' => 'required|in:pending,in-progress,completed',
        ]);

        $task = new Task([
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'status' => $request->input('status'),
            'user_id' => Auth::id(), // Assign the task to the logged-in user
        ]);
        $task->save();

        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    // Display a specific task's details
    public function show(Task $task)
    {
        // Check if the task belongs to the authenticated user
        if ($task->user_id !== Auth::id()) {
            return redirect()->route('tasks.index')->with('error', 'Unauthorized access.');
        }
        return view('tasks.show', compact('task'));
    }
}
