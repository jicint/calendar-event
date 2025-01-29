<?php

namespace App\Http\Controllers;

use Google_Client;
use Google_Service_Calendar;
use Google_Service_Calendar_Event;
use Illuminate\Http\Request;

class GoogleCalendarController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setAuthConfig(storage_path('app/google/credentials.json'));
        $this->client->addScope(Google_Service_Calendar::CALENDAR);
    }

    public function createEvent(Request $request)
    {
        try {
            $this->client->setAccessToken($request->token);
            
            $service = new Google_Service_Calendar($this->client);
            
            $event = new Google_Service_Calendar_Event([
                'summary' => $request->title,
                'description' => $request->description,
                'start' => [
                    'dateTime' => $request->start_time,
                    'timeZone' => 'Your/Timezone',
                ],
                'end' => [
                    'dateTime' => $request->end_time,
                    'timeZone' => 'Your/Timezone',
                ],
            ]);

            $calendarId = 'primary';
            $event = $service->events->insert($calendarId, $event);

            return response()->json([
                'status' => 'success',
                'event' => $event,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
} 