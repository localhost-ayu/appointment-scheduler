<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('professional_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professional_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->tinyInteger('day_of_week')->unsigned();
            $table->time('start_time');
            $table->time('end_time');
            $table->timestamps();

            $table->unique(['professional_id', 'day_of_week', 'start_time'], 'prof_schedule_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('professional_schedules');
    }
};