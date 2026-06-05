<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
            'professional_id' => ['required', 'integer', 'exists:professionals,id'],
            'service_id' => ['required', 'integer', 'exists:services,id'],
            'starts_at' => ['required', 'date_format:Y-m-d H:i', 'after:now'],
        ];
    }
}