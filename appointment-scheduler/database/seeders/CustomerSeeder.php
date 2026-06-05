<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        Customer::create([
            'name' => 'Carlos Mendes',
            'phone' => '51999990001',
        ]);

        Customer::create([
            'name' => 'Ana Souza',
            'phone' => '51999990002',
        ]);
    }
}