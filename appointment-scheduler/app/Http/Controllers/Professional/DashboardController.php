<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'filter' => ['sometimes', 'string', 'in:day,week,month,year'],
            'date' => ['sometimes', 'string'],
        ]);

        $filter = $request->input('filter', 'day');
        $date = $request->input('date', now()->toDateString());

        $metrics = $this->dashboardService->getMetrics(
            $request->user(),
            $filter,
            $date
        );

        return response()->json($metrics);
    }
}