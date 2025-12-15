<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class RunescapeController extends Controller
{
    private const BASE_URL = 'https://cycleonv2api-production.up.railway.app';

    /**
     * Add CORS headers to response
     */
    private function addCorsHeaders(JsonResponse $response): JsonResponse
    {
        return $response->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type');
    }

    /**
     * Proxy for /items endpoint
     */
    public function items(): JsonResponse
    {
        try {
            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::BASE_URL . '/items');

            return $this->addCorsHeaders(response()->json($response->json(), $response->status()));

        } catch (\Exception $e) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Failed to fetch items'
            ], 500));
        }
    }

    /**
     * Proxy for /items/{id} endpoint
     */
    public function item(string $id): JsonResponse
    {
        try {
            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::BASE_URL . "/items/{$id}");

            return $this->addCorsHeaders(response()->json($response->json(), $response->status()));

        } catch (\Exception $e) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Failed to fetch item details'
            ], 500));
        }
    }

    /**
     * Proxy for /predictions/{id} endpoint
     */
    public function predictions(string $id): JsonResponse
    {
        try {
            $period = request()->query('period', '30'); // Default to 30 days

            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::BASE_URL . "/predictions/{$id}?period={$period}");

            return $this->addCorsHeaders(response()->json($response->json(), $response->status()));

        } catch (\Exception $e) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Failed to fetch predictions'
            ], 500));
        }
    }

    /**
     * Handle OPTIONS request for CORS preflight
     */
    public function options(): JsonResponse
    {
        return $this->addCorsHeaders(response()->json([], 200));
    }
}
