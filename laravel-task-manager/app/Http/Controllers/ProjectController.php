<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Project;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProjectController extends Controller
{
    public function createProject(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:4|max:20',
            'description' => 'required|string|max:100'
        ]);

        $user = Auth::user();

        /** @var \App\Models\User $user **/
        $projectTitleExists = $user->projects()->where('projects.title', $validatedData['title'])->exists();

        if($projectTitleExists)
        {
            return response()->json([
                'message' => 'Project creation failed. User already has a project with the same title.',
                'status' => 'failed',
                'data' => [] 
            ]);
        }

        $project = new Project([
            'title' => $validatedData['title'],
            'description' => $validatedData['description']
        ]);

        $project->user_id = $user->id;
        $project->status = 'active';
        $project->progress = 0;
        $project->end_date = $request->end_Date;

        $project->save();

        return response()->json([
            'message' => 'Project created successfully!',
            'status' => 'success',
            'data' => $project
        ], 201);
    }

    public function getProjects($id = null)
    {
        if ($id) {
            try {
                $project = Project::findOrFail($id);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'Project not found!',
                    'status' => 'failed',
                    'data' => [] 
                ], 201);
            }

            if ($project->user_id == Auth::id()) {
                return response()->json([
                    'message' => 'Project retrieved successfully!',
                    'status' => 'success',
                    'data' => $project
                ], 201);
            } else {
                return response()->json([
                    'message' => 'Unauthorised Access!',
                    'status' => 'failed',
                    'data' => [] 
                ], 201);
            }
        } else {
            $user = Auth::user();

            $projects = $user->projects;

            return response()->json([
                'message' => 'Projects retrieved successfully!',
                'status' => 'success',
                'data' => $projects
            ], 201);
        }
    }

    public function updateProject(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:4|max:20',
            'description' => 'required|string|max:100',
            'status' => 'required|in:active,completed,paused,cancelled',
            'progress' => 'integer|min:0|max:100',
            'id' => 'required|integer'
        ]);

        try {
            $project = Project::findOrFail($validatedData['id']);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'failed',
                'data' => [] 
            ], 201);
        }

        $user = Auth::user();

        /** @var \App\Models\User $user **/
        $projectTitleExists = $user->projects()
        ->where('projects.title', $validatedData['title'])
        ->where('projects.id', '!=', $validatedData['id'])
        ->exists();

        if($projectTitleExists){
            return response()->json([
                'message' => 'Project update failed. Target title already exists.',
                'status' => 'failed',
                'data' => [] 
            ], 201);
        }

        if (Auth::id() == $project->user_id) {
            $project->update([$validatedData['title'], $validatedData['description']]);

            if (!empty($validatedData['status'])) $project->status = $validatedData['status'];

            $project->save();

            return response()->json([
                'message' => 'Project updated successfully',
                'status' => 'success'
            ], 201);
        } else {
            return response()->json([
                'message' => 'Unauthorized Access!',
                'status' => 'success'
            ], 201);
        }
    }

    public function deleteProject($id)
    {
        try {
            $project = Project::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'failed',
                'data' => [] 
            ], 201);
        }


        if (Auth::id() == $project->user_id) {
            $project->delete();

            return response()->json([
                'message' => 'Project deleted successfully!',
                'status' => 'success'
            ], 201);
        } else {
            return response()->json([
                'message' => 'Unauthorized Access!',
                'status' => 'success'
            ], 201);
        }
    }
}
