<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarEventController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setAuthConfig(storage_path('app/google/credentials.json'));
        $this->client->addScope(Google_Service_Calendar::CALENDAR);
    }

    public function createEventFromText(Request $request)
    {
        try {
            \Log::info('Received request:', $request->all());
            $text = strtolower($request->input('text'));
            
            // Parse the time
            preg_match('/at (\d{1,2}(?::\d{2})?\s*(?:am|pm))/', $text, $timeMatches);
            $timeStr = $timeMatches[1] ?? null;
            
            // Parse "tomorrow" or specific date
            $date = null;
            if (strpos($text, 'tomorrow') !== false) {
                $date = Carbon::tomorrow();
            } else {
                // Add more date parsing logic here if needed
                $date = Carbon::today();
            }
            
            // Parse location (after "at" but not time-related)
            preg_match('/at\s+(?!\d{1,2}(?::\d{2})?\s*(?:am|pm))([^,\.]+)/', $text, $locationMatches);
            $location = trim($locationMatches[1] ?? '');

            // Create event time
            if ($timeStr && $date) {
                $startTime = Carbon::parse($timeStr)->setDateFrom($date);
                $endTime = $startTime->copy()->addHour(); // Default 1-hour duration
            }

            $this->client->setAccessToken($request->token);
            $service = new Google_Service_Calendar($this->client);
            
            $event = new Google_Service_Calendar_Event([
                'summary' => $text, // Use full text as summary
                'location' => $location,
                'start' => [
                    'dateTime' => $startTime->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ],
                'end' => [
                    'dateTime' => $endTime->toRfc3339String(),
                    'timeZone' => config('app.timezone'),
                ],
            ]);

            $calendarId = 'primary';
            $event = $service->events->insert($calendarId, $event);

            return response()->json([
                'status' => 'success',
                'event' => $event,
                'parsed' => [
                    'time' => $startTime->format('g:i A'),
                    'date' => $startTime->format('Y-m-d'),
                    'location' => $location,
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Calendar error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
} 