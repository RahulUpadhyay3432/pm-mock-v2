# PM Mock Interviewer

A comprehensive product management interview practice platform with voice capabilities and AI-powered feedback.

## Features

- **Two Interview Modes**: Text and Voice (with speech recognition)
- **AI-Powered Questions**: Dynamic question generation using OpenAI
- **Detailed Scoring**: Structured rubric evaluation across 5 key areas
- **Voice Integration**: Browser-based speech recognition and text-to-speech
- **Timer System**: Configurable countdown timer (60/90/120 seconds)
- **Interview History**: Track progress with detailed analytics
- **Authentication**: Secure login with NextAuth (Google OAuth + Email)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon recommended)
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4 for question generation and evaluation
- **Voice**: Web Speech API (Browser-based STT/TTS)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- OpenAI API key
- Google OAuth credentials (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pm-mock-interviewer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for NextAuth
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth credentials

### Database Setup

1. Generate Prisma client:
```bash
npm run db:generate
```

2. Push database schema:
```bash
npm run db:push
```

3. (Optional) Run migrations in production:
```bash
npm run db:migrate
```

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

Run the test suite:
```bash
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

## Usage

### Getting Started
1. Sign in with Google or email
2. Configure your preferences in Settings (timer duration, question types)
3. Start an interview from the dashboard

### Interview Flow
1. **Setup**: Choose between Text or Voice mode
2. **Question**: AI generates a relevant PM question
3. **Answer**: Respond within the time limit
4. **Evaluation**: Receive detailed feedback and scoring
5. **Review**: View results and coaching tips

### Voice Mode Features
- Automatic question reading via text-to-speech
- Real-time speech recognition with interim results
- Voice feedback summary after completion
- Graceful fallback to text mode if unsupported

### Keyboard Shortcuts
- `Space`: Start/stop recording (Voice mode)
- `R`: Retry interview (after completion)

## API Routes

- `POST /api/generate-question`: Generate new interview questions
- `POST /api/evaluate-answer`: Evaluate and score responses
- `GET/POST /api/attempts`: Manage interview attempts
- `GET /api/session`: OpenAI Realtime session (TODO)

## Database Schema

### Core Models
- **User**: NextAuth user management
- **PMAttempt**: Interview attempts with scores and feedback
- **Account/Session**: NextAuth session management

### Scoring System
- Structure & Framework (0-5)
- Clarity & Communication (0-5) 
- Product Thinking (0-5)
- Metrics & Measurement (0-5)
- Storytelling (0-5)
- Overall Score (0-100)

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## Configuration

### Question Types
- **Product Sense**: User empathy, problem identification, solution design
- **Estimation**: Market sizing, logical breakdown, assumptions
- **Execution**: Prioritization, roadmapping, stakeholder management  
- **Strategy**: Market analysis, competitive positioning, business model

### Voice Providers
- **Browser**: Built-in Web Speech API (free, offline capable)
- **OpenAI Realtime**: Higher accuracy (coming soon)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the GitHub issues
2. Review the documentation
3. Create a new issue with detailed information

---

Built with ❤️ for the PM community