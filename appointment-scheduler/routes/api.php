<?php

use App\Http\Controllers\Booking\AppointmentController;
use App\Http\Controllers\Booking\AvailabilityController;
use App\Http\Controllers\Booking\IdentifyController;
use App\Http\Controllers\Booking\ProfessionalController;
use App\Http\Controllers\Professional\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
});

// Public booking routes, no authentication required
Route::prefix('booking')->group(function () {
    Route::post('/identify', IdentifyController::class);
    Route::get('/professionals', [ProfessionalController::class, 'index']);
    Route::get('/professionals/{professional}/services', [ProfessionalController::class, 'services']);
    Route::get('/professionals/{professional}/availability', AvailabilityController::class);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::get('/appointments/{appointmentNumber}', [AppointmentController::class, 'show']);
    Route::post('/appointments/{appointmentNumber}/cancel', [AppointmentController::class, 'cancel']);
    Route::post('/appointments/{appointmentNumber}/reschedule', [AppointmentController::class, 'reschedule']);
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