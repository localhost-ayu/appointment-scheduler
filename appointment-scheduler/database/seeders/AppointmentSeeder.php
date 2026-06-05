<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Professional;
use App\Models\Service;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $professional = Professional::first();
        $carlos = Customer::where('phone', '51999990001')->first();
        $ana = Customer::where('phone', '51999990002')->first();
        $haircut = Service::where('name', 'Haircut')->first();
        $beard = Service::where('name', 'Beard Trim')->first();
        $combo = Service::where('name', 'Haircut + Beard')->first();

        $appointments = [
            // Today — pending
            [
                'customer' => $carlos,
                'service' => $haircut,
                'starts_at' => today()->setTimeFromTimeString('09:00:00'),
            ],
            // Today — pending
            [
                'customer' => $ana,
                'service' => $beard,
                'starts_at' => today()->setTimeFromTimeString('10:00:00'),
            ],
            // Today — completed
            [
                'customer' => $carlos,
                'service' => $combo,
                'starts_at' => today()->setTimeFromTimeString('14:00:00'),
                'status' => 'completed',
            ],
            // Tomorrow — pending
            [
                'customer' => $ana,
                'service' => $haircut,
                'starts_at' => today()->addDay()->setTimeFromTimeString('09:30:00'),
            ],
            // Yesterday — completed
            [
                'customer' => $carlos,
                'service' => $beard,
                'starts_at' => today()->subDay()->setTimeFromTimeString('10:00:00'),
                'status' => 'completed',
            ],
            // Last week — cancelled
            [
                'customer' => $ana,
                'service' => $combo,
                'starts_at' => today()->subDays(7)->setTimeFromTimeString('11:00:00'),
                'status' => 'cancelled',
            ],
        ];

        foreach ($appointments as $index => $data) {
            $service = $data['service'];
            $startsAt = $data['starts_at'];
            $endsAt = $startsAt->copy()->addMinutes($service->duration);
            $status = $data['status'] ?? 'pending';

            $appointment = Appointment::create([
                'professional_id' => $professional->id,
                'customer_id' => $data['customer']->id,
                'service_id' => $service->id,
                'starts_at' => $startsAt,
                'ends_at' => $endsAt,
                'status' => $status,
                'price_at_booking' => $service->price,
                'duration_at_booking' => $service->duration,
            ]);

            $year = $startsAt->format('Y');
            $appointment->update([
                'appointment_number' => 'APT-' . $year . '-' . str_pad($appointment->id, 6, '0', STR_PAD_LEFT),
            ]);
        }
    }
}