<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'appointment_number' => $this->appointment_number,
            'status' => $this->status,
            'starts_at' => $this->starts_at->toISOString(),
            'ends_at' => $this->ends_at->toISOString(),
            'price' => (float) $this->price_at_booking,
            'duration' => $this->duration_at_booking,
            'notes' => $this->notes,
            'professional' => ProfessionalResource::make($this->whenLoaded('professional')),
            'customer' => CustomerResource::make($this->whenLoaded('customer')),
            'service' => ServiceResource::make($this->whenLoaded('service')),
        ];
    }
}