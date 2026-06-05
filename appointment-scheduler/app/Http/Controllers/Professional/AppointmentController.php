<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Services\AppointmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function __construct(
        private AppointmentService $appointmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'filter' => ['sometimes', 'string', 'in:day,week,month,year'],
            'date' => ['sometimes', 'string'],
            'status' => ['sometimes', 'string', 'in:pending,completed,cancelled'],
        ]);

        $filter = $request->input('filter', 'day');
        $date = $request->input('date', now()->toDateString());

        [$start, $end] = $this->resolveDateRange($filter, $date);

        $query = Appointment::where('professional_id', $request->user()->id)
            ->whereBetween('starts_at', [$start, $end])
            ->with(['customer', 'service'])
            ->orderBy('starts_at');

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        return response()->json([
            'data' => AppointmentResource::collection($query->get()),
        ]);
    }

    public function complete(Request $request, string $appointmentNumber): JsonResponse
    {
        $appointment = Appointment::where('appointment_number', $appointmentNumber)
            ->where('professional_id', $request->user()->id)
            ->firstOrFail();

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be marked as completed.',
            ], 422);
        }

        $appointment->update(['status' => 'completed']);

        return response()->json([
            'data' => AppointmentResource::make(
                $appointment->fresh(['professional', 'customer', 'service'])
            ),
        ]);
    }

    public function cancel(Request $request, string $appointmentNumber): JsonResponse
    {
        $appointment = Appointment::where('appointment_number', $appointmentNumber)
            ->where('professional_id', $request->user()->id)
            ->firstOrFail();

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be cancelled.',
            ], 422);
        }

        $this->appointmentService->cancel($appointment);

        return response()->json([
            'data' => AppointmentResource::make(
                $appointment->fresh(['professional', 'customer', 'service'])
            ),
        ]);
    }

    private function resolveDateRange(string $filter, string $date): array
    {
        return match ($filter) {
            'week' => [
                \Carbon\Carbon::parse($date)->startOfWeek(),
                \Carbon\Carbon::parse($date)->endOfWeek(),
            ],
            'month' => [
                \Carbon\Carbon::parse($date)->startOfMonth(),
                \Carbon\Carbon::parse($date)->endOfMonth(),
            ],
            'year' => [
                \Carbon\Carbon::parse($date)->startOfYear(),
                \Carbon\Carbon::parse($date)->endOfYear(),
            ],
            default => [
                \Carbon\Carbon::parse($date)->startOfDay(),
                \Carbon\Carbon::parse($date)->endOfDay(),
            ],
        };
    }
}