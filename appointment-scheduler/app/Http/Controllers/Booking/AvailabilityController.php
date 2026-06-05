<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Professional;
use App\Models\Service;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function __construct(
        private AvailabilityService $availabilityService
    ) {}

    public function __invoke(Request $request, Professional $professional): JsonResponse
    {
        $request->validate([
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
        ]);

        $service = Service::findOrFail($request->integer('service_id'));

        if (! $professional->active) {
            return response()->json(['message' => 'Professional not found.'], 404);
        }

        $slots = $this->availabilityService->getAvailableSlots(
            $professional,
            $request->input('date'),
            $service
        );

        return response()->json([
            'date' => $request->input('date'),
            'professional_id' => $professional->id,
            'service_id' => $service->id,
            'duration_minutes' => $service->duration,
            'slots' => $slots,
        ]);
    }
}