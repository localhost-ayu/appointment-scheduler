<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'duration',
        'price',
        'active',
    ];

    protected function casts(): array
    {
        return [
            'active' => 'boolean',
            'price' => 'decimal:2',
            'duration' => 'integer',
        ];
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}