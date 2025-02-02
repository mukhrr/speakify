# Speakify - IELTS Mock Exam Simulator

A modern IELTS exam simulation platform built with Next.js, TypeScript, and AI-powered speaking assessment.

## Features

- 🎯 Complete IELTS mock exams (Reading, Writing, Listening, Speaking)
- 🎙️ AI-powered speaking assessment using HUME AI
- ⏱️ Real-time exam timing and progress tracking
- 📊 Detailed performance analytics
- 💾 Secure data storage with Supabase
- 🎨 Modern UI with Tailwind CSS and shadcn/ui

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase
- **AI Integration**: HUME AI
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## Prerequisites

- Node.js 18.17 or later
- Supabase account
- HUME AI API key

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/speakify.git
   cd speakify
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase and HUME AI credentials.

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries and configurations
├── services/          # External service integrations
├── styles/            # Global styles and Tailwind CSS
├── types/             # TypeScript type definitions
└── utils/             # Helper functions and utilities
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [HUME AI](https://hume.ai/)
- [shadcn/ui](https://ui.shadcn.com/)
