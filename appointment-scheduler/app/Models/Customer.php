<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'phone',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}