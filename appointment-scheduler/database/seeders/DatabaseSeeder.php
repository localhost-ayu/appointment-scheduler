<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            ProfessionalSeeder::class,
            ServiceSeeder::class,
            CustomerSeeder::class,
            AppointmentSeeder::class,
        ]);
    }
}