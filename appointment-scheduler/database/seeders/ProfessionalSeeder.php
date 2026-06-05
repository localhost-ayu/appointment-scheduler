<?php

namespace Database\Seeders;

use App\Models\Professional;
use Illuminate\Database\Seeder;

class ProfessionalSeeder extends Seeder
{
    public function run(): void
    {
        $professional = Professional::create([
            'name' => 'João Silva',
            'email' => 'joao@example.com',
            'password' => 'password',
            'bio' => 'Specialist with over 10 years of experience. Focused on quality and customer satisfaction.',
            'photo' => null,
            'active' => true,
        ]);

        // Weekly schedule with lunch break
        // Monday through Friday: 09:00–12:00 and 14:00–18:00
        // Saturday: 09:00–13:00 (no afternoon block)
        $weekdays = [1, 2, 3, 4, 5];

        foreach ($weekdays as $day) {
            $professional->schedules()->createMany([
                [
                    'day_of_week' => $day,
                    'start_time' => '09:00:00',
                    'end_time' => '12:00:00',
                ],
                [
                    'day_of_week' => $day,
                    'start_time' => '14:00:00',
                    'end_time' => '18:00:00',
                ],
            ]);
        }

        // Saturday morning only
        $professional->schedules()->create([
            'day_of_week' => 6,
            'start_time' => '09:00:00',
            'end_time' => '13:00:00',
        ]);
    }
}