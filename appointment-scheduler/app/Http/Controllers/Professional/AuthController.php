<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $professional = Professional::where('email', $credentials['email'])->first();

        if (! $professional || ! \Illuminate\Support\Facades\Hash::check($credentials['password'], $professional->password)) {
            return response()->json([
                'message' => 'Invalid credentials.',
            ], 401);
        }

        $token = $professional->createToken('professional-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'professional' => [
                'id' => $professional->id,
                'name' => $professional->name,
                'email' => $professional->email,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}