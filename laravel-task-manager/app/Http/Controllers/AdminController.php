<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function getAdmins()
    {
        $users = User::where('role', 'admin')->get();

        return response()->json([
            'message' => 'Admins retrieved successfully',
            'status' => 'success',
            'data' => $users
        ]);
    }

    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email'
        ]);

        $user = new User();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::Make('password');

        $user->save();

        return response()->json([
            'message' => 'User created successfully!',
            'status' => 'success'
        ], 201);
    }

    public function updateUserRole(Request $request, $id)
    {
        $validatedData = $request->validate([
            'role' => 'required|in:admin,user,manager'
        ]);

        if (Auth::user()->role != 'admin') {
            return response()->json([
                'message' => 'Unauthorized action!',
                'status' => 'failed'
            ]);
        }

        try {
            $userToUpdate = User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User not found!',
                'status' => 'failed'
            ]);
        }

        if ($userToUpdate->role == 'admin') {
            return response()->json([
                'message' => 'User is an Admin. Unauthorized action!',
                'status' => 'failed'
            ]);
        }

        $userToUpdate->role = $validatedData['role'];
        $userToUpdate->save();

        return response()->json([
            'message' => 'User role updated successfully',
            'status' => 'success'
        ]);
    }

    public function deleteUser($id)
    {
        if (Auth::user()->role != 'admin' || Auth::id() == $id) {
            return response()->json([
                'message' => 'Unauthorized action!',
                'status' => 'failed'
            ]);
        }

        try {
            $userToDelete = User::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'User to delete not found!',
                'status' => 'failed'
            ]);
        }

        if ($userToDelete->role == 'admin') {
            return response()->json([
                'message' => 'User is an Admin. Unauthorized action!',
                'status' => 'failed'
            ]);
        }

        $userToDelete->delete();

        return response()->json([
            'message' => 'User deleted successfully.',
            'status' => 'success'
        ], 200);
    }
}
