<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function createUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = new User();

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->password = Hash::Make($validated['password']);

        $user->save();

        if (User::count() == 1) {
            $user->role = 'admin';
            $user->save();
        }

        $credentials = $request->only('email', 'password');
        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            /** @var \App\Models\User $user **/
            $token = $user->createToken('auth_token')->plainTextToken;
        }

        return response()->json([
            'message' => 'Welcome to Task Manager!',
            'status' => 'success',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function getUsers($id = null)
    {
        if ($id) {
            try {
                $user = User::findOrFail($id);
            } catch (ModelNotFoundException $e) {
                return response()->json([
                    'message' => 'User not found.',
                    'status' => 'failed',
                ], 200);
            }

            return response()->json([
                'status' => 'success',
                'data' => $user
            ], 200);
        } else {
            $users = User::all();

            return response()->json([
                'status' => 'success',
                'data' => $users
            ], 200);
        }
    }

    public function updateUser(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:255',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = Auth::user();

        if (!empty($validatedData['name'])) $user->name = $validatedData['name'];
        if (!empty($validatedData['email'])) $user->email = $validatedData['email'];

        if (!empty($validatedData['password'])) {
            $user->password = Hash::make($validatedData['password']);
        }

        /** @var \App\Models\User $user **/
        $user->save();

        return response()->json([
            'message' => 'User profile updated successfully'
        ], 200);
    }

    public function deleteUser(Request $request)
    {
        $validatedData = $request->validate([
            'password' => 'required|min:6|confirmed'
        ]);

        $user = Auth::user();

        if (Hash::check($validatedData['password'], $user->password)) {
            /** @var \App\Models\User $user **/
            $user->delete();

            return response()->json([
                'message' => 'Account deleted',
                'status' => 'success'
            ], 200);
        } else {
            return response()->json([
                'message' => 'Incorrect Password!',
                'status' => 'failed'
            ], 200);
        }
    }
}
