<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Haircut',
                'duration' => 30,
                'price' => 45.00,
                'active' => true,
            ],
            [
                'name' => 'Beard Trim',
                'duration' => 20,
                'price' => 30.00,
                'active' => true,
            ],
            [
                'name' => 'Haircut + Beard',
                'duration' => 50,
                'price' => 70.00,
                'active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}