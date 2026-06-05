<?php

use App\Http\Controllers\Professional\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
});

// Public booking routes — no authentication required
Route::prefix('booking')->group(function () {
    // Block 7
});

// Professional routes
Route::prefix('professional')->group(function () {

    // Public — unauthenticated
    Route::post('/login', [AuthController::class, 'login']);

    // Protected — requires valid Sanctum token
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);

        // Block 8 routes go here
    });
});