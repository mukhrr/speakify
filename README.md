# Speakify - IELTS Mock Exam Simulator

A modern IELTS exam simulation platform built with Next.js, TypeScript, and AI-powered speaking assessment.

## Features

- 🎯 Complete IELTS mock exams (Reading, Writing, Listening, Speaking)
- 🎙️ AI-powered speaking assessment using HUME AI
- ⏱️ Real-time exam timing and progress tracking
- 📊 Detailed performance analytics
- 💾 Secure data storage with Supabase
- 🎨 Modern UI with Tailwind CSS and shadcn/ui
- 🌙 Dark mode support with next-themes
- 🚀 Turbo Dev Server for faster development

## Tech Stack

- **Framework**: Next.js 15.1, React 19, TypeScript
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS, CSS Modules
- **Backend**: Supabase
- **AI Integration**: HUME AI
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod
- **Icons**: Lucide React

## Prerequisites

- Node.js 18.17 or later
- Supabase account
- HUME AI API key
- Git for version control

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/speakify.git
   cd speakify
   ```

2. Install dependencies:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase and HUME AI credentials.

4. Run the development server:

   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                # Next.js app router pages
│   ├── exam/          # Exam module pages
│   ├── auth/          # Authentication pages
│   └── dashboard/     # User dashboard
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   ├── exam/         # Exam-specific components
│   ├── layout/       # Layout components
│   └── shared/       # Shared components
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
│   ├── utils/        # Utility functions
│   ├── supabase/     # Supabase client
│   └── hume/         # HUME AI integration
├── styles/           # Global styles
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Development Tools

- **Formatting**: Prettier
- **Linting**: ESLint with TypeScript and React rules
- **Type Checking**: TypeScript
- **Git Hooks**: Husky (optional)
- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

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
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
