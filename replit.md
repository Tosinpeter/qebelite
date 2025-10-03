# QEB Elite Fitness Admin Dashboard

## Overview

QEB Elite is a comprehensive fitness application admin dashboard built with React and Express. The platform enables administrators to manage users, organize group fitness sessions (huddles), curate nutrition content, and maintain a library of training videos. The application features a modern, dark-mode-first interface designed for efficiency and data density, allowing administrators to quickly access and manipulate fitness-related content across multiple categories.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and caching

**UI Framework:**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Design system inspired by Material Design and Linear, prioritizing information density and efficient workflows

**Component Structure:**
- Page-level components in `/client/src/pages` for each major section (Dashboard, Users, Huddles, Nutrition, Weight Room, Home Settings)
- Reusable UI components in `/client/src/components/ui` following atomic design principles
- Custom hooks in `/client/src/hooks` for shared logic (mobile detection, toast notifications)

**State Management:**
- React Query handles server state with automatic caching and invalidation
- Local component state for UI interactions
- No global state management library (Redux/Zustand) - server state is the source of truth

**Design Rationale:**
The architecture separates concerns cleanly between data fetching (React Query), routing (Wouter), and UI rendering (React). This approach keeps the codebase maintainable while providing excellent developer experience with TypeScript type inference throughout the stack.

### Backend Architecture

**Technology Stack:**
- Express.js for RESTful API server
- TypeScript for type safety across backend code
- Drizzle ORM for database interactions with PostgreSQL
- Neon serverless PostgreSQL for cloud-native database hosting

**API Structure:**
- RESTful endpoints following resource-based patterns (`/api/home-banners`, `/api/home-widgets`, etc.)
- Centralized route registration in `/server/routes.ts`
- Zod schemas for runtime request validation
- Middleware for logging, error handling, and request parsing

**Database Layer:**
- Drizzle ORM provides type-safe database queries
- Schema definitions in `/shared/schema.ts` shared between client and server
- Automatic type generation from database schema using `drizzle-zod`
- Connection pooling via `@neondatabase/serverless`

**Storage Abstraction:**
- `IStorage` interface in `/server/storage.ts` defines data access contract
- `DatabaseStorage` implementation provides PostgreSQL-backed persistence
- Enables future storage backend changes without modifying route handlers

**Design Rationale:**
The backend uses a clean layered architecture: routes handle HTTP concerns, storage handles data access, and the database layer handles persistence. This separation enables testing, maintainability, and potential migration to different data stores. Shared schema definitions between frontend and backend eliminate type mismatches.

### Data Schema

**Core Entities:**

1. **Users** - Application users with roles (admin, coach, user) and status tracking
2. **Huddles** - Scheduled group fitness sessions with metadata and status
3. **Nutrition Plans** - Meal plans categorized by type (daily/weekly) with structured meal data
4. **Training Videos** - Video library with categorization, duration, and thumbnails
5. **Home Widgets** - Configurable dashboard widgets with positioning and visibility controls
6. **Home Banners** - Promotional banners with images and redirect URLs

**Schema Design Decisions:**
- UUID primary keys (`gen_random_uuid()`) for distributed systems compatibility
- Shared types between client/server via TypeScript for compile-time safety
- Drizzle-Zod integration automatically generates runtime validators from schema
- Arrays stored as PostgreSQL native array types for flexible meal/exercise lists

### Development Environment

**Build Process:**
- Vite handles frontend bundling with hot module replacement
- esbuild bundles backend code for production deployment
- TypeScript compilation checked separately via `tsc --noEmit`
- Development server proxies API requests to Express backend

**Development Tools:**
- Replit-specific plugins for in-browser development
- Runtime error overlay for debugging
- Automatic type checking across monorepo structure

**Design Rationale:**
The monorepo structure keeps frontend and backend code together while maintaining clear boundaries. Shared code in `/shared` enables type reuse. Vite's speed improves developer experience, while esbuild produces efficient production bundles.

## External Dependencies

### Database
- **Neon Serverless PostgreSQL** - Cloud-hosted PostgreSQL database with WebSocket connections for serverless environments
- Connection managed via `@neondatabase/serverless` package with connection pooling

### UI Component Libraries
- **Radix UI** - Headless, accessible component primitives for dialogs, dropdowns, tooltips, and form controls
- **Shadcn/ui** - Pre-styled component layer built on Radix UI with Tailwind CSS integration
- Provides 30+ production-ready components (Button, Card, Dialog, Select, etc.)

### Styling and Design
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens
- **Google Fonts** - Inter (primary font) and JetBrains Mono (monospace) loaded via CDN
- Custom color palette supporting both light and dark modes with HSL color space

### Data Fetching and Validation
- **TanStack Query** - Server state management with automatic caching, background refetching, and optimistic updates
- **Zod** - Schema validation for API requests and runtime type checking
- **React Hook Form** with Zod resolvers for form validation

### Development Dependencies
- **TypeScript** - Type safety across entire codebase
- **Vite** - Development server and build tool
- **Drizzle Kit** - Database migration tools and schema management

### Design Rationale
External dependencies were chosen to maximize developer productivity while maintaining type safety. Radix UI provides accessible primitives without imposing design opinions. TanStack Query eliminates manual cache management. Drizzle ORM keeps database queries type-safe and composable. All dependencies work together to support the TypeScript-first architecture.