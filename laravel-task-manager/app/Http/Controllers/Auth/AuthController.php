<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Show the login form
    public function showLoginForm()
    {
        return view('auth.login');
    }

    // Handle login logic
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            /** @var \App\Models\User $user **/
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User logged in!',
                'auth_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        }

        return response()->json([
            'message' => 'Log in failed!',
            'status' => 'failed'
        ], 200);
    }

    // Show the registration form
    public function showRegisterForm()
    {
        return view('auth.register');
    }

    // Handle registration logic
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
        ]);

        Auth::login($user);

        return response()->json([
            'message' => 'Registration successfull!',
            'status' => 'success',
        ], 200);
    }

    // Handle logout logic
    public function logout()
    {
        Auth::logout();

        return response()->json([
            'message' => 'Logged out successfully!',
            'status' => 'success',
        ], 200);
    }
}
