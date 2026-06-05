<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Professional;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AvailabilityService
{
    /**
     * Get available time slots for a professional on a given date for a given service.
     *
     * @return array<string> List of available time strings in "HH:MM" format
     */
    public function getAvailableSlots(
        Professional $professional,
        string $date,
        Service $service
    ): array {
        // Step 1 — Parse the requested date
        $requestedDate = Carbon::parse($date);

        // Step 2 — Reject past dates immediately
        if ($requestedDate->isPast() && ! $requestedDate->isToday()) {
            return [];
        }

        // Step 3 — Find schedule blocks for this day of week
        $dayOfWeek = (int) $requestedDate->format('w'); // 0=Sunday, 6=Saturday

        $scheduleBlocks = $professional->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->orderBy('start_time')
            ->get();

        if ($scheduleBlocks->isEmpty()) {
            return [];
        }

        // Step 4 — Check if this date is marked as unavailable
        $isUnavailable = $professional->unavailableDates()
            ->whereDate('date', $requestedDate->toDateString())
            ->exists();

        if ($isUnavailable) {
            return [];
        }

        // Step 5 — Load existing occupying appointments for this professional on this date
        $existingAppointments = Appointment::where('professional_id', $professional->id)
            ->occupying()
            ->forDate($requestedDate->toDateString())
            ->get(['starts_at', 'ends_at']);

        // Step 6 — Generate slots across all schedule blocks
        $slots = [];

        foreach ($scheduleBlocks as $block) {
            $blockSlots = $this->generateSlotsForBlock(
                $requestedDate,
                $block->start_time,
                $block->end_time,
                $service->duration,
                $existingAppointments
            );

            $slots = array_merge($slots, $blockSlots);
        }

        return $slots;
    }

    /**
     * Generate available slots within a single schedule block.
     *
     * @param  Collection  $existingAppointments
     * @return array<string>
     */
    private function generateSlotsForBlock(
        Carbon $date,
        string $blockStart,
        string $blockEnd,
        int $durationMinutes,
        Collection $existingAppointments
    ): array {
        $slots = [];

        $current = Carbon::parse($date->toDateString() . ' ' . $blockStart);
        $end = Carbon::parse($date->toDateString() . ' ' . $blockEnd);
        $now = Carbon::now();

        while (true) {
            $slotEnd = $current->copy()->addMinutes($durationMinutes);

            // Slot must fit entirely within the block
            if ($slotEnd->greaterThan($end)) {
                break;
            }

            // Skip slots that have already passed today
            if ($date->isToday() && $current->lessThanOrEqualTo($now)) {
                $current->addMinutes($durationMinutes);
                continue;
            }

            // Check against all existing appointments for overlap
            if (! $this->overlapsWithExisting($current, $slotEnd, $existingAppointments)) {
                $slots[] = $current->format('H:i');
            }

            $current->addMinutes($durationMinutes);
        }

        return $slots;
    }

    /**
     * Check if a proposed slot overlaps with any existing appointment.
     *
     * Overlap condition: A overlaps B if A.start < B.end AND A.end > B.start
     */
    private function overlapsWithExisting(
        Carbon $slotStart,
        Carbon $slotEnd,
        Collection $existingAppointments
    ): bool {
        foreach ($existingAppointments as $appointment) {
            $appointmentStart = Carbon::parse($appointment->starts_at);
            $appointmentEnd = Carbon::parse($appointment->ends_at);

            if ($slotStart->lessThan($appointmentEnd) && $slotEnd->greaterThan($appointmentStart)) {
                return true;
            }
        }

        return false;
    }
}