<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\RescheduleAppointmentRequest;
use App\Http\Requests\Booking\StoreAppointmentRequest;
use App\Http\Resources\AppointmentResource;
use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Professional;
use App\Models\Service;
use App\Services\AppointmentService;
use Carbon\Carbon;
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
            'phone' => ['required', 'string'],
        ]);

        $customer = Customer::where('phone', $request->input('phone'))->first();

        if (! $customer) {
            return response()->json(['message' => 'Customer not found.'], 404);
        }

        $appointments = $customer->appointments()
            ->with(['professional', 'service'])
            ->orderBy('starts_at', 'desc')
            ->get();

        return response()->json([
            'data' => AppointmentResource::collection($appointments),
        ]);
    }

    public function show(string $appointmentNumber): JsonResponse
    {
        $appointment = Appointment::where('appointment_number', $appointmentNumber)
            ->with(['professional', 'customer', 'service'])
            ->firstOrFail();

        return response()->json([
            'data' => AppointmentResource::make($appointment),
        ]);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $customer = Customer::findOrFail($request->integer('customer_id'));
        $professional = Professional::findOrFail($request->integer('professional_id'));
        $service = Service::findOrFail($request->integer('service_id'));

        try {
            $appointment = $this->appointmentService->book(
                $customer,
                $professional,
                $service,
                $request->input('starts_at')
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'data' => AppointmentResource::make($appointment),
        ], 201);
    }

    public function cancel(Request $request, string $appointmentNumber): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
        ]);

        $appointment = Appointment::where('appointment_number', $appointmentNumber)
            ->with(['customer', 'professional', 'service'])
            ->firstOrFail();

        if ($appointment->customer->phone !== $request->input('phone')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be cancelled.',
            ], 422);
        }

        $this->appointmentService->cancel($appointment);

        return response()->json([
            'data' => AppointmentResource::make($appointment->fresh(['professional', 'customer', 'service'])),
        ]);
    }

    public function reschedule(RescheduleAppointmentRequest $request, string $appointmentNumber): JsonResponse
    {
        $appointment = Appointment::where('appointment_number', $appointmentNumber)
            ->with(['customer', 'professional', 'service'])
            ->firstOrFail();

        if ($appointment->customer->phone !== $request->input('phone')) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending appointments can be rescheduled.',
            ], 422);
        }

        $startsAt = Carbon::parse($request->input('starts_at'));

        try {
            $newAppointment = $this->appointmentService->reschedule(
                $appointment,
                $appointment->professional,
                $appointment->service,
                $startsAt->format('Y-m-d H:i')
            );
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 409);
        }

        return response()->json([
            'data' => AppointmentResource::make($newAppointment),
        ], 201);
    }
}