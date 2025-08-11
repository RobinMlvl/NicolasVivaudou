# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (uses Turbopack for faster builds)
- **Production build**: `npm run build`
- **Production server**: `npm run start`
- **Linting**: `npm run lint`

## Architecture Overview

This is a Next.js 15 multilingual portfolio application using App Router architecture with internationalization support:

- **Framework**: Next.js 15.4.5 with React 19
- **Internationalization**: next-intl with French (default) and English locales
- **Styling**: Tailwind CSS v4 with PostCSS and inline theming
- **Fonts**: Quicksand (headings) and Roboto (body text) from Google Fonts
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

### Development Notes

- Uses Turbopack in development for faster hot reloading
- Path aliases configured with `@/*` pointing to project root in `jsconfig.json`
- ESLint uses flat config format (`eslint.config.mjs`) with FlatCompat for Next.js rules
- PostCSS configured with Tailwind CSS v4 plugin
- Font optimization with variable weights: Quicksand (300-700) and Roboto (300-700)