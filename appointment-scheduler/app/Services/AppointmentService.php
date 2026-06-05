<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Professional;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    public function __construct(
        private AvailabilityService $availabilityService
    ) {}

    public function book(
        Customer $customer,
        Professional $professional,
        Service $service,
        string $startsAt
    ): Appointment {
        return DB::transaction(function () use ($customer, $professional, $service, $startsAt) {
            $start = Carbon::parse($startsAt);
            $end = $start->copy()->addMinutes($service->duration);

            // Race condition guard — re-check availability inside the transaction
            $available = $this->availabilityService->getAvailableSlots(
                $professional,
                $start->toDateString(),
                $service
            );

            if (! in_array($start->format('H:i'), $available)) {
                throw new \RuntimeException('The selected time slot is no longer available.');
            }

            $appointment = Appointment::create([
                'professional_id' => $professional->id,
                'customer_id' => $customer->id,
                'service_id' => $service->id,
                'starts_at' => $start,
                'ends_at' => $end,
                'status' => 'pending',
                'price_at_booking' => $service->price,
                'duration_at_booking' => $service->duration,
            ]);

            $appointment->update([
                'appointment_number' => 'APT-' . $start->format('Y') . '-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT),
            ]);

            return $appointment->fresh(['professional', 'customer', 'service']);
        });
    }

    public function cancel(Appointment $appointment): Appointment
    {
        $appointment->update(['status' => 'cancelled']);
        return $appointment;
    }

    public function reschedule(
        Appointment $appointment,
        Professional $professional,
        Service $service,
        string $newStartsAt
    ): Appointment {
        return DB::transaction(function () use ($appointment, $professional, $service, $newStartsAt) {
            $this->cancel($appointment);
            return $this->book(
                $appointment->customer,
                $professional,
                $service,
                $newStartsAt
            );
        });
    }
}