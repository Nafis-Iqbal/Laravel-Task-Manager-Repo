<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;

class ProjectController extends Controller
{
    public function createProject(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:4|max:20|unique:projects,title',
            'description' => 'required|string|max:100'
        ]);

        $project = new Project();
        $user = Auth::user();

        $project->title = $validatedData['title'];
        $project->description = $validatedData['description'];
        $project->user_id = $user->id;
        $project->status = 'active';

        $project->save();

        return response()->json([
            'message' => 'Project created successfully!',
            'status' => 'success'
        ], 201);
    }

    public function getProjects($id = null)
    {
        if ($id) {
            $project = Project::findOrFail($id);

            return response()->json([
                'message' => 'Project retrieved successfully!',
                'status' => 'success',
                'data' => $project
            ], 201);
        } else {
            $user = Auth::user();

            /** @var \App\Models\User $user **/
            $projects = $user->projects;

            return response()->json([
                'message' => 'Projects retrieved successfully!',
                'status' => 'success',
                'data' => $projects
            ], 201);
        }
    }

    public function deleteProject($id)
    {
        $project = Project::findOrFail($id);

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully!',
            'status' => 'success'
        ], 201);
    }

    public function updateProject(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'nullable|string|min:4|max:20|unique:projects,title',
            'description' => 'nullable|string|max:100',
            'status' => 'required|in:active,completed,paused,cancelled'
        ]);

        $project = Project::findOrFail($id);

        if (!empty($validatedData['title'])) $project->title = $validatedData['title'];
        if (!empty($validatedData['description'])) $project->description = $validatedData['description'];
        if (!empty($validatedData['status'])) $project->status = $validatedData['status'];

        $project->save();

        return response()->json([
            'message' => 'Project updated successfully',
            'status' => 'success'
        ], 201);
    }
}
