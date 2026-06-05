<?php

use App\Http\Controllers\Booking\AppointmentController;
use App\Http\Controllers\Booking\AvailabilityController;
use App\Http\Controllers\Booking\IdentifyController;
use App\Http\Controllers\Booking\ProfessionalController;
use App\Http\Controllers\Professional\AuthController;
use App\Http\Controllers\Professional\DashboardController;
use App\Http\Controllers\Professional\AppointmentController as ProfessionalAppointmentController;
use App\Http\Controllers\Professional\ScheduleController;
use App\Http\Controllers\Professional\UnavailableDateController;
use App\Http\Controllers\Professional\ProfileController;
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
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/dashboard', DashboardController::class);
        Route::get('/appointments', [ProfessionalAppointmentController::class, 'index']);
        Route::post('/appointments/{appointmentNumber}/complete', [ProfessionalAppointmentController::class, 'complete']);
        Route::post('/appointments/{appointmentNumber}/cancel', [ProfessionalAppointmentController::class, 'cancel']);
        Route::get('/schedule', [ScheduleController::class, 'index']);
        Route::put('/schedule', [ScheduleController::class, 'update']);
        Route::get('/unavailable-dates', [UnavailableDateController::class, 'index']);
        Route::post('/unavailable-dates', [UnavailableDateController::class, 'store']);
        Route::delete('/unavailable-dates/{unavailableDate}', [UnavailableDateController::class, 'destroy']);
        Route::get('/profile', [ProfileController::class, 'show']);
        Route::put('/profile', [ProfileController::class, 'update']);
    });
});