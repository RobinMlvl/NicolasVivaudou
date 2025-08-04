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
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Quicksand and Roboto from Google Fonts
- **Linting**: ESLint with Next.js core web vitals configuration

### Internationalization Architecture

- **Middleware**: `middleware.ts` handles locale detection and routing using next-intl
- **Routing**: Configured for French (`fr`) as default locale and English (`en`)
- **Locale Structure**: `app/[locale]/` contains localized pages and layouts
- **Messages**: Translation files in `messages/fr.json` and `messages/en.json`
- **Configuration**: 
  - `src/i18n/routing.ts` - Locale routing configuration
  - `src/i18n/request.ts` - Request-time locale handling
  - `src/i18n/navigation.ts` - Internationalized navigation helpers

### Key Files and Structure

- `app/[locale]/layout.js` - Localized root layout with font configuration and navbar
- `app/[locale]/page.js` - Localized homepage component
- `components/home/` - Home page components (Hero, About, Portfolio, Navbar)
- `components/portfolio/` - Portfolio-specific components
- `middleware.ts` - next-intl middleware for locale routing
- `next.config.mjs` - Next.js configuration with next-intl plugin
- `jsconfig.json` - Path mapping with `@/*` alias

### Development Notes

- The project uses Turbopack in development for faster hot reloading
- Font optimization uses Quicksand (variable weight) and Roboto fonts
- Locale detection happens at middleware level with fallback to French
- Path aliases are configured with `@/*` pointing to project root
- ESLint uses flat config format with Next.js core web vitals rules