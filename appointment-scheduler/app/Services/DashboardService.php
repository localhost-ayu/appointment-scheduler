<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Professional;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getMetrics(Professional $professional, string $filter, string $date): array
    {
        [$start, $end] = $this->resolveDateRange($filter, $date);

        $base = Appointment::where('professional_id', $professional->id)
            ->whereBetween('starts_at', [$start, $end]);

        $total = (clone $base)->count();
        $completed = (clone $base)->where('status', 'completed')->count();
        $pending = (clone $base)->where('status', 'pending')->count();
        $cancelled = (clone $base)->where('status', 'cancelled')->count();
        $revenue = (clone $base)->where('status', 'completed')->sum('price_at_booking');

        // Today's metrics always included as a reference
        $todayStart = Carbon::today();
        $todayEnd = Carbon::today()->endOfDay();
        $todayBase = Appointment::where('professional_id', $professional->id)
            ->whereBetween('starts_at', [$todayStart, $todayEnd]);

        return [
            'filter' => $filter,
            'period_start' => $start->toDateString(),
            'period_end' => $end->toDateString(),
            'total' => $total,
            'completed' => $completed,
            'pending' => $pending,
            'cancelled' => $cancelled,
            'revenue' => (float) $revenue,
            'today' => [
                'total' => (clone $todayBase)->count(),
                'completed' => (clone $todayBase)->where('status', 'completed')->count(),
                'pending' => (clone $todayBase)->where('status', 'pending')->count(),
                'revenue' => (float) (clone $todayBase)->where('status', 'completed')->sum('price_at_booking'),
            ],
        ];
    }

    private function resolveDateRange(string $filter, string $date): array
    {
        return match ($filter) {
            'day' => [
                Carbon::parse($date)->startOfDay(),
                Carbon::parse($date)->endOfDay(),
            ],
            'week' => [
                Carbon::parse($date)->startOfWeek(),
                Carbon::parse($date)->endOfWeek(),
            ],
            'month' => [
                Carbon::parse($date)->startOfMonth(),
                Carbon::parse($date)->endOfMonth(),
            ],
            'year' => [
                Carbon::parse($date)->startOfYear(),
                Carbon::parse($date)->endOfYear(),
            ],
            default => [
                Carbon::parse($date)->startOfDay(),
                Carbon::parse($date)->endOfDay(),
            ],
        };
    }
}