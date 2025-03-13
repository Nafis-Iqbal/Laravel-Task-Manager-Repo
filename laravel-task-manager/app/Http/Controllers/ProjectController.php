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
            'title' => 'required|string|min:4|max:20|unique:projects,title',
            'description' => 'required|string|max:100'
        ]);

        $project = new Project([
            'title' => $validatedData['title'],
            'description' => $validatedData['description']
        ]);

        $user = Auth::user();

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
                ], 201);
            }
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

    public function updateProject(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:4|max:20|unique:projects,title' . $id,
            'description' => 'required|string|max:100',
            'status' => 'required|in:active,completed,paused,cancelled',
            'progress' => 'integer|min:0|max:100'
        ]);

        try {
            $project = Project::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Project not found.',
                'status' => 'failed'
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
                'status' => 'failed'
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
