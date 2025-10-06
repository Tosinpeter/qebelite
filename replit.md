# QEB Elite Fitness Admin Dashboard

## Overview

QEB Elite is a comprehensive fitness application admin dashboard built with React and Supabase. The platform enables administrators to manage users, organize group fitness sessions (huddles), curate nutrition content, maintain a library of training videos, and schedule 1:1 coaching sessions. The application features a modern, dark-mode-first interface designed for efficiency and data density, allowing administrators to quickly access and manipulate fitness-related content across multiple categories.

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
- Page-level components in `/client/src/pages` for each major section (Dashboard, Users, Huddles, Nutrition, Weight Room, Athlete Resources, Schedule 1:1 Coaching, Home Settings)
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
- Supabase as the complete backend solution (database, authentication, storage)
- Direct client-to-Supabase communication (no Express middleware)
- PostgreSQL database with Row Level Security (RLS) policies
- Supabase Storage for file uploads (avatars, images)
- Supabase Auth for user authentication

**Data Access Layer:**
- Query helpers in `/client/src/lib/supabase-queries.ts` encapsulate all database operations
- Type-safe operations using Supabase client with TypeScript types from shared schema
- Organized by entity (users, huddles, nutrition, videos, home content, weight room, athlete resources, coaching sessions)
- Each helper provides CRUD operations (getAll, getById, create, update, delete)

**Database Security:**
- Row Level Security (RLS) policies control data access
- Frontend uses Supabase anon key for all operations
- RLS policies must be configured in Supabase console or via migrations
- Storage buckets have public access policies for uploads/reads

**Authentication:**
- Supabase Auth for user signup/login
- User profiles stored in `user_profiles` table
- Profile creation triggered automatically after Supabase Auth signup
- Role-based access control (admin, coach, user) stored in profiles

**Design Rationale:**
The Supabase-only architecture eliminates the need for a custom backend server, simplifying deployment and reducing maintenance overhead. All business logic runs on the client, with Supabase handling authentication, authorization (via RLS), and data persistence. This serverless approach scales automatically and provides real-time capabilities out of the box.

### Data Schema

**Core Entities:**

1. **Users** - Application users with roles (admin, coach, user) and status tracking
2. **Huddles** - Scheduled group fitness sessions with metadata and status
3. **Nutrition Plans** - Meal plans categorized by type (daily/weekly) with structured meal data
4. **Training Videos** - Video library with categorization, duration, and thumbnails
5. **Home Widgets** - Configurable dashboard widgets with positioning and visibility controls
6. **Home Banners** - Promotional banners with images and redirect URLs
7. **Athlete Resources** - External resource links with images, descriptions, and positioning
8. **Coaching Availability** - Admin-controlled weekly availability schedule for 1:1 coaching sessions
9. **Coaching Sessions** - Booked 1:1 coaching appointments with client details and session status

**Schema Design Decisions:**
- UUID primary keys (`gen_random_uuid()`) for distributed systems compatibility
- Shared types between client/server via TypeScript for compile-time safety
- Drizzle-Zod integration automatically generates runtime validators from schema
- Arrays stored as PostgreSQL native array types for flexible meal/exercise lists

### Development Environment

**Build Process:**
- Vite handles all bundling with hot module replacement
- Pure frontend application - no backend build required
- TypeScript compilation checked via `tsc --noEmit`
- Development server: `npm run dev` runs `vite` directly

**Development Tools:**
- Replit-specific plugins for in-browser development
- Runtime error overlay for debugging
- Automatic type checking for frontend code

**Deployment:**
- Static site deployment (Vite build output)
- No server-side code to deploy
- Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Supabase handles all backend infrastructure

**Design Rationale:**
The simplified architecture eliminates build complexity and deployment overhead. Vite produces an optimized static bundle that can be deployed anywhere. Supabase provides all backend services, removing the need for server maintenance.

## External Dependencies

### Database and Backend
- **Supabase** - Complete backend-as-a-service platform providing PostgreSQL database, authentication, storage, and real-time subscriptions
- **Supabase Client** (`@supabase/supabase-js`) - Official JavaScript client for interacting with Supabase services
- Direct database access from frontend using Supabase client with automatic connection pooling
- Row Level Security (RLS) policies enforce data access rules at the database level

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
- **Drizzle ORM/Zod** - Schema definitions and validation (shared between Supabase and frontend)

### Design Rationale
External dependencies were chosen to maximize developer productivity while maintaining type safety. Radix UI provides accessible primitives without imposing design opinions. TanStack Query eliminates manual cache management. Supabase provides a complete backend solution eliminating the need for custom server code. All dependencies work together to support the TypeScript-first architecture.

## Row Level Security (RLS) Configuration

Since the application uses Supabase's anon key from the frontend, Row Level Security policies must be configured for secure data access.

**Required RLS Policies:**

1. **Storage Policies (user-avatars bucket)**:
   - Allow public uploads: `CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-avatars');`
   - Allow public reads: `CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'user-avatars');`
   - Allow public updates: `CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING (bucket_id = 'user-avatars');`
   - Allow public deletes: `CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'user-avatars');`

2. **Storage Policies (recipe-images bucket)**:
   - Bucket must be created first in Supabase Dashboard: Storage → New Bucket → Name: `recipe-images` (make it public)
   - Allow public uploads: `CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'recipe-images');`
   - Allow public reads: `CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'recipe-images');`
   - Allow public updates: `CREATE POLICY "Allow public updates" ON storage.objects FOR UPDATE USING (bucket_id = 'recipe-images');`
   - Allow public deletes: `CREATE POLICY "Allow public deletes" ON storage.objects FOR DELETE USING (bucket_id = 'recipe-images');`

3. **Database Table Policies**:
   For admin dashboard functionality, tables need permissive RLS policies or RLS disabled. Options:
   
   **Option A - Disable RLS** (simplest for admin tools):
   ```sql
   ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE huddles DISABLE ROW LEVEL SECURITY;
   ALTER TABLE nutrition_plans DISABLE ROW LEVEL SECURITY;
   ALTER TABLE training_videos DISABLE ROW LEVEL SECURITY;
   ALTER TABLE home_slider DISABLE ROW LEVEL SECURITY;
   ALTER TABLE home_widget DISABLE ROW LEVEL SECURITY;
   ALTER TABLE weight_room_collections DISABLE ROW LEVEL SECURITY;
   ALTER TABLE athlete_resources DISABLE ROW LEVEL SECURITY;
   ```
   
   **Option B - Role-based RLS** (more secure):
   ```sql
   -- Example for user_profiles table
   CREATE POLICY "Admin full access" ON user_profiles 
     FOR ALL 
     USING (auth.jwt() ->> 'role' = 'admin');
   ```

**Important Notes:**
- Storage policies are currently configured for public access
- Database RLS policies should be configured based on security requirements
- For admin-only dashboards, consider disabling RLS or using role-based policies
- Use Supabase SQL Editor or migrations to apply these policies