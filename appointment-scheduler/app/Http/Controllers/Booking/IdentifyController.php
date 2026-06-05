<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\IdentifyCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;

class IdentifyController extends Controller
{
    public function __invoke(IdentifyCustomerRequest $request): JsonResponse
    {
        $phone = $request->input('phone');
        $existing = Customer::where('phone', $phone)->first();

        if ($existing) {
            $hasUpcoming = $existing->appointments()
                ->pending()
                ->where('starts_at', '>', now())
                ->exists();

            return response()->json([
                'status' => 'returning',
                'customer' => CustomerResource::make($existing),
                'has_upcoming_appointments' => $hasUpcoming,
            ]);
        }

        $customer = Customer::create([
            'name' => $request->input('name'),
            'phone' => $phone,
        ]);

        return response()->json([
            'status' => 'created',
            'customer' => CustomerResource::make($customer),
            'has_upcoming_appointments' => false,
        ], 201);
    }
}