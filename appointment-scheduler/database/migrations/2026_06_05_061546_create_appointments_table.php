<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_number', 20)->nullable()->unique();
            $table->foreignId('professional_id')
                  ->constrained()
                  ->restrictOnDelete();
            $table->foreignId('customer_id')
                  ->constrained()
                  ->restrictOnDelete();
            $table->foreignId('service_id')
                  ->constrained()
                  ->restrictOnDelete();
            $table->dateTime('starts_at');
            $table->dateTime('ends_at');
            $table->enum('status', ['pending', 'completed', 'cancelled'])
                  ->default('pending');
            $table->decimal('price_at_booking', 8, 2);
            $table->smallInteger('duration_at_booking')->unsigned();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['professional_id', 'starts_at']);
            $table->index('customer_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};