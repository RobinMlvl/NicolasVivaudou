# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build`
- **Production server**: `npm run start`
- **Linting**: `npm run lint`
- **Database schema**: `npm run prisma:generate` (generate Prisma client)
- **Database migration**: `npm run prisma:push` (push schema changes)
- **Database studio**: `npm run prisma:studio` (open Prisma Studio)
- **Database reset**: `npm run prisma:reset` (reset database)
- **Supabase setup**: `npm run setup:supabase` (configure storage bucket)

## Architecture Overview

This is a Next.js 15 multilingual portfolio application using App Router architecture with internationalization support:

- **Framework**: Next.js 15.4.5 with React 19
- **Internationalization**: next-intl with French (default) and English locales
- **Database**: PostgreSQL with Prisma ORM (models: PortfolioImage, ContactMessage)
- **Storage**: Supabase for image/video file storage with compression support
- **Styling**: Tailwind CSS v4 with PostCSS and inline theming
- **Fonts**: Quicksand (headings) and Roboto (body text) from Google Fonts
- **Email**: Resend for contact form notifications and confirmations
- **Linting**: ESLint with flat config and Next.js core web vitals rules

### Internationalization Architecture

The i18n system uses next-intl with a centralized routing configuration:

- **Core Configuration**: `src/i18n/routing.ts` defines supported locales (`fr`, `en`) with French as default
- **Middleware**: `middleware.ts` handles automatic locale detection and routing
- **Request Handling**: `src/i18n/request.ts` manages server-side locale context
- **Navigation**: `src/i18n/navigation.ts` provides typed navigation helpers
- **Messages**: Translation files in `messages/fr.json` and `messages/en.json`

The routing follows the pattern `/{locale}/path` with middleware matching `/(fr|en)/:path*` and handling root path redirects.

### Component Architecture

- **Layout System**: `app/[locale]/layout.js` provides the root layout with:
  - Font variable injection (`--font-quicksand`, `--font-roboto`)
  - NextIntlClientProvider wrapper for client-side translations
  - Fixed navbar positioning with z-index management
- **Home Components**: Modular components in `components/home/` (Hero, About, Services, Portfolio, Contact, Footer, Navbar)
- **Styling System**: Tailwind v4 with custom CSS variables in `globals.css` and inline theme configuration

### Data Architecture

- **Database**: PostgreSQL with Prisma ORM
  - `PortfolioImage`: Stores portfolio items with ordering, visibility, categories (drone/portrait)
  - `ContactMessage`: Stores contact form submissions with read status
- **File Storage**: Supabase Storage
  - Bucket: `portfolio-images` (configurable via env)
  - Image/video uploads with automatic URL generation
  - Client video compression using MediaRecorder API in `hooks/useVideoCompression.js`
  - Support for large file uploads (1GB limit configured in `next.config.mjs`)

### Admin System

- **Authentication**: JWT-based with hardcoded credentials (`nicolasvivaudou7893` / `bidkoc-gajti6-sIzzug`)
- **Admin routes**: `/[locale]/admin/*` with protected layout and middleware authentication
- **Portfolio management**: Upload, edit, reorder, delete images/videos with drag-and-drop
- **Contact management**: View and mark contact messages as read
- **Features**: Real-time image optimization, video compression, batch operations

### Email System (Resend)

- **Configuration**: Requires `RESEND_API_KEY` and `NOTIFICATION_EMAIL` in environment variables
- **Notification emails**: Sent to `malaval.robin@hotmail.fr` when contact form is submitted
- **Confirmation emails**: Sent to users confirming their message was received
- **Templates**: Professional HTML templates with responsive design and branding
- **Testing**: Test endpoint at `/api/test-email` for configuration verification
- **Files**: 
  - `lib/email.js`: Email templates and sending functions
  - `app/api/contact/route.js`: Contact form API with email integration
  - `app/api/test-email/route.js`: Email testing and configuration check

### Development Notes

- Uses Turbopack in development for faster hot reloading
- Path aliases configured with `@/*` pointing to project root in `jsconfig.json`
- ESLint uses flat config format (`eslint.config.mjs`) with FlatCompat for Next.js rules
- PostCSS configured with Tailwind CSS v4 plugin
- Font optimization with variable weights: Quicksand (300-700) and Roboto (300-700)
- Server Actions configured for 1GB file uploads to support video content