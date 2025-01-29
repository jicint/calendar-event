<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleCalendarController;
use App\Http\Controllers\CalendarEventController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/calendar/create-event', [GoogleCalendarController::class, 'createEvent']);
Route::post('/calendar/create-event-from-text', [CalendarEventController::class, 'createEventFromText']);
