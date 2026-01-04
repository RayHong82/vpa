# SG Prop-Agent Assistant

AI-powered Singapore property transaction assistant built with Next.js 15, Tailwind CSS, and Shadcn UI.

## Features

- 🎨 **Apple Design Language** - Beautiful, modern UI with frosted glass effects
- 📱 **PWA Support** - Installable as a Progressive Web App
- 🚀 **Next.js 15** - Latest App Router with React Server Components
- 🎭 **Framer Motion** - Smooth animations and interactions
- 🎯 **Shadcn UI** - Customizable component library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file with your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up the Supabase database:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Run the migration files in `supabase/migrations/` in order
   - See `supabase/README.md` for detailed instructions

4. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
vpa/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   ├── chat/              # Chat interface
│   ├── planner/           # Financial planner
│   └── settings/          # Settings page
├── components/
│   ├── layout/            # Layout components (TopNav, BottomDock)
│   └── ui/                # Shadcn UI components
├── lib/                   # Utility functions
│   └── supabase/         # Supabase client configuration
├── supabase/
│   └── migrations/        # Database migration files
└── public/                # Static assets
```

## PWA Icons

To complete PWA setup, add the following icons to `/public`:
- `apple-touch-icon.png` (180x180px)
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
- `favicon.ico`

See `public/README-icons.md` for details.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion
- **UI Components**: Shadcn/UI
- **Icons**: Lucide React
- **State Management**: Nuqs (URL-based state)
- **Backend**: Supabase (PostgreSQL + pgvector + Auth)

## Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## License

Private project

