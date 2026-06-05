<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Http\Requests\Professional\StoreUnavailableDateRequest;
use App\Http\Resources\Professional\UnavailableDateResource;
use App\Models\ProfessionalUnavailableDate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UnavailableDateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $dates = $request->user()
            ->unavailableDates()
            ->where('date', '>=', now()->toDateString())
            ->orderBy('date')
            ->get();

        return response()->json([
            'data' => UnavailableDateResource::collection($dates),
        ]);
    }

    public function store(StoreUnavailableDateRequest $request): JsonResponse
    {
        $unavailable = $request->user()->unavailableDates()->firstOrCreate(
            ['date' => $request->input('date')],
            ['reason' => $request->input('reason')]
        );

        return response()->json([
            'data' => UnavailableDateResource::make($unavailable),
        ], 201);
    }

    public function destroy(Request $request, ProfessionalUnavailableDate $unavailableDate): JsonResponse
    {
        if ($unavailableDate->professional_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $unavailableDate->delete();

        return response()->json(null, 204);
    }
}