<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Appointment extends Model
{
    protected $fillable = [
        'appointment_number',
        'professional_id',
        'customer_id',
        'service_id',
        'starts_at',
        'ends_at',
        'status',
        'price_at_booking',
        'duration_at_booking',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'price_at_booking' => 'decimal:2',
            'duration_at_booking' => 'integer',
        ];
    }

    // Relationships

    public function professional(): BelongsTo
    {
        return $this->belongsTo(Professional::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    // Scopes

    public function scopePending(Builder $query): void
    {
        $query->where('status', 'pending');
    }

    public function scopeCompleted(Builder $query): void
    {
        $query->where('status', 'completed');
    }

    public function scopeCancelled(Builder $query): void
    {
        $query->where('status', 'cancelled');
    }

    public function scopeOccupying(Builder $query): void
    {
        $query->whereIn('status', ['pending', 'completed']);
    }

    public function scopeForDate(Builder $query, string $date): void
    {
        $query->whereDate('starts_at', $date);
    }
}