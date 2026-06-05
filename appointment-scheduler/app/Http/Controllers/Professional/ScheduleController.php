<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Http\Requests\Professional\UpdateScheduleRequest;
use App\Http\Resources\Professional\ScheduleBlockResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $blocks = $request->user()
            ->schedules()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => ScheduleBlockResource::collection($blocks),
        ]);
    }

    public function update(UpdateScheduleRequest $request): JsonResponse
    {
        $professional = $request->user();

        // Replace entire schedule atomically
        \Illuminate\Support\Facades\DB::transaction(function () use ($professional, $request) {
            $professional->schedules()->delete();

            foreach ($request->input('blocks') as $block) {
                $professional->schedules()->create([
                    'day_of_week' => $block['day_of_week'],
                    'start_time' => $block['start_time'] . ':00',
                    'end_time' => $block['end_time'] . ':00',
                ]);
            }
        });

        $blocks = $professional->schedules()
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'data' => ScheduleBlockResource::collection($blocks),
        ]);
    }
}