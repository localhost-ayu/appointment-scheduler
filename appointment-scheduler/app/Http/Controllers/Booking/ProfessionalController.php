<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfessionalResource;
use App\Http\Resources\ServiceResource;
use App\Models\Professional;
use Illuminate\Http\JsonResponse;

class ProfessionalController extends Controller
{
    public function index(): JsonResponse
    {
        $professionals = Professional::where('active', true)->get();

        return response()->json([
            'data' => ProfessionalResource::collection($professionals),
        ]);
    }

    public function services(Professional $professional): JsonResponse
    {
        if (! $professional->active) {
            return response()->json(['message' => 'Professional not found.'], 404);
        }

        $services = \App\Models\Service::where('active', true)->get();

        return response()->json([
            'data' => ServiceResource::collection($services),
        ]);
    }
}