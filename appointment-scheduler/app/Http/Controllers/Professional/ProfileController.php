<?php

namespace App\Http\Controllers\Professional;

use App\Http\Controllers\Controller;
use App\Http\Resources\Professional\ProfessionalProfileResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json([
            'data' => ProfessionalProfileResource::make($request->user()),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'name' => ['sometimes', 'string', 'max:100'],
            'bio' => ['sometimes', 'nullable', 'string'],
            'photo' => ['sometimes', 'nullable', 'string'],
        ]);

        $request->user()->update($request->only(['name', 'bio', 'photo']));

        return response()->json([
            'data' => ProfessionalProfileResource::make($request->user()->fresh()),
        ]);
    }
}