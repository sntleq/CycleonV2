<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;

class RunescapeController extends Controller
{
    private const BASE_URL = 'https://cycleonv2api-production.up.railway.app';
    private const RUNESCAPE_API_URL = 'https://api.weirdgloop.org';

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
            $period = request()->query('period', '30');

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
     * Proxy for /rankings/price endpoint
     */
    public function rankings(): JsonResponse
    {
        try {
            $n = request()->query('n', 8);

            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::BASE_URL . "/rankings/price?n={$n}");

            return $this->addCorsHeaders(response()->json($response->json(), $response->status()));

        } catch (\Exception $e) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Failed to fetch rankings'
            ], 500));
        }
    }

    /**
     * Proxy for /rankings/volume endpoint
     */
    public function topTrades(): JsonResponse
    {
        try {
            $n = request()->query('n', 8);

            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::BASE_URL . "/rankings/volume?n={$n}");

            return $this->addCorsHeaders(response()->json($response->json(), $response->status()));

        } catch (\Exception $e) {
            return $this->addCorsHeaders(response()->json([
                'error' => 'Failed to fetch top trades'
            ], 500));
        }
    }

    /**
     * Get last update timestamp (converted to Philippine Time)
     */
    public function lastUpdate(): JsonResponse
    {
        try {
            // Fetch from API
            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get(self::RUNESCAPE_API_URL . '/exchange');

            if (!$response->successful()) {
                throw new \Exception('Failed to fetch last update');
            }

            $data = $response->json();

            // Get the RS timestamp
            $rsTimestamp = $data['rs'] ?? null;

            if (!$rsTimestamp) {
                throw new \Exception('RS timestamp not found in response');
            }

            // Parse the UTC timestamp from API
            $utcTime = new \DateTime($rsTimestamp, new \DateTimeZone('UTC'));

            // Convert to Philippine Time (UTC+8)
            $phTimeZone = new \DateTimeZone('Asia/Manila');
            $phTime = clone $utcTime;
            $phTime->setTimezone($phTimeZone);

            // Format: MM/DD/YY h:i A (12-hour format with AM/PM)
            $formattedDate = $phTime->format('m/d/y h:i A');

            // Also keep original UTC for reference
            $utcFormatted = $utcTime->format('m/d/y h:i A');

            return $this->addCorsHeaders(response()->json([
                'timestamp' => $rsTimestamp,
                'formatted_date' => $formattedDate,
                'utc_time' => $utcFormatted,
                'timezone' => 'Asia/Manila (UTC+8)',
                'original_timestamp' => $rsTimestamp,
                'success' => true
            ]));

        } catch (\Exception $e) {
            // Fallback: Use current Philippine time
            $phTimeZone = new \DateTimeZone('Asia/Manila');
            $now = new \DateTime('now', $phTimeZone);
            $formattedDate = $now->format('m/d/y h:i A');

            return $this->addCorsHeaders(response()->json([
                'formatted_date' => $formattedDate . ' (approx)',
                'timezone' => 'Asia/Manila (UTC+8)',
                'note' => 'Using current PH time as fallback',
                'success' => true
            ], 200));
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
