# Natural Language Calendar Event Creator

A Laravel + React application that creates Google Calendar events from natural language input. Simply type something like "meeting at 10 am tomorrow at office" and the app will create a calendar event automatically.

## Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- Google Cloud Console account

## Installation

1. Clone the repository
2. Install PHP dependencies
3. Install JavaScript dependencies
4. Copy environment file and configure
5. Set up Google Calendar API:
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create a new project
- Enable Google Calendar API
- Create OAuth 2.0 credentials
- Download credentials JSON file
- Place it at: `storage/app/google/credentials.json`
- Add your email as a test user in OAuth consent screen

6. Update your `.env` file with your Google client ID:


## Development

1. Start the Laravel development server:
2. Start the Vite development server:
3. Visit `http://localhost:8000` in your browser

## Usage

Simply type your event details in natural language, for example:
- "meeting with team at 2pm tomorrow at office"
- "lunch at 12pm tomorrow at cafeteria"

The app will automatically parse the time, date, and location to create a Google Calendar event.

## Security

Remember to:
- Keep your `credentials.json` file secure
- Add to `.gitignore` to prevent committing sensitive data
- Use environment variables for sensitive information

## License

[MIT License](LICENSE)