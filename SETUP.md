# Local Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**To get your Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the "Project URL" and paste it as `VITE_SUPABASE_URL`
5. Copy the "anon public" key and paste it as `VITE_SUPABASE_ANON_KEY`

### 3. Database Setup
The project uses Supabase as the backend. You'll need to:
1. Set up your database schema (see `supabase/schema.sql`)
2. Configure Row Level Security (RLS) policies
3. Set up storage buckets for file uploads

### 4. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure
- `client/` - React frontend application
- `server/` - Express server (minimal, mainly for development)
- `shared/` - Shared TypeScript types and schemas
- `supabase/` - Database schema and migrations

## Features
- User management
- Huddle (group fitness) management
- Nutrition plan management
- Training video library
- Weight room collections
- Athlete resources
- 1:1 coaching scheduling
- Home page customization

## Notes
- This project was originally designed for Replit but has been adapted for local development
- The frontend communicates directly with Supabase (no custom backend required)
- All authentication and data management is handled by Supabase
