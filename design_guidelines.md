# Admin Dashboard Design Guidelines

## Design Approach

**Selected Approach:** Design System-Based (Material Design + Linear inspiration)
**Justification:** Admin dashboard requires high information density, efficient workflows, and data manipulation. Drawing from Material Design for robust component patterns and Linear's clean, modern aesthetics for visual polish.

**Core Principles:**
- Efficiency over aesthetics: Fast task completion
- Clear information hierarchy: Critical data immediately visible
- Consistent patterns: Reduce cognitive load across sections
- Purposeful density: Information-rich without clutter

## Color Palette

**Dark Mode Primary (Default):**
- Background: 220 15% 8% (deep charcoal)
- Surface: 220 13% 12% (elevated panels)
- Surface Elevated: 220 13% 15% (cards, modals)
- Border: 220 10% 20% (subtle dividers)

**Brand/Accent Colors:**
- Primary: 145 70% 45% (energetic green for fitness context)
- Primary Hover: 145 70% 40%
- Danger: 0 70% 55% (delete, warnings)
- Warning: 38 95% 55% (countdown urgency)
- Success: 145 60% 50% (completion states)

**Text Colors:**
- Primary Text: 0 0% 95%
- Secondary Text: 0 0% 65%
- Muted Text: 0 0% 45%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 145 60% 40%
- Text: 220 15% 15%

## Typography

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - clean, professional, excellent readability
- Monospace: JetBrains Mono - for data tables, IDs, technical info

**Hierarchy:**
- Page Headers: text-2xl font-semibold (admin section titles)
- Section Headers: text-lg font-medium (widget headers, table headers)
- Body Text: text-sm font-normal (forms, descriptions, content)
- Data/Metrics: text-base font-medium (user counts, stats)
- Labels: text-xs font-medium uppercase tracking-wide (form labels, badges)

## Layout System

**Spacing Convention:** Use Tailwind units of 2, 4, 6, 8, 12, 16 for consistency
- Component padding: p-4 or p-6
- Section gaps: gap-6 or gap-8
- Tight spacing: space-x-2, space-y-2
- Generous spacing: space-y-8

**Grid Structure:**
- Sidebar Navigation: Fixed 256px width (w-64)
- Main Content: Remaining space with max-w-7xl container
- Responsive: Sidebar collapses to icon-only on mobile (<768px)

## Component Library

### Navigation
- **Sidebar:** Dark surface with section groups, active state with primary accent left border
- **Top Bar:** Breadcrumbs, search, admin profile, notifications
- **Section Tabs:** Underline style for subsections (Daily/Weekly in Nutrition)

### Data Display
- **Tables:** Striped rows, hover states, sortable headers, sticky header on scroll
- **User Cards:** Avatar, name, email, role badge, action buttons (Edit/Delete icons)
- **Video Thumbnails:** 16:9 ratio cards with play overlay, duration badge, category tag
- **Stats Cards:** Large numbers with labels, subtle background, icon indicators

### Interactive Elements
- **Countdown Timer:** Large display with days:hours:mins:secs, warning color when <24hrs
- **Drag-Drop Widgets:** Drag handles (⋮⋮ icon), ghost preview while dragging, drop zones with dashed borders
- **Forms:** Floating labels, validation states (red border + error text), disabled states with opacity
- **Action Buttons:** Primary (filled), Secondary (outline), Danger (filled red), Icon-only (ghost)

### Content Management
- **Video Upload:** Drag-drop zone, progress bars, thumbnail preview after upload
- **Collection Builder:** Tag-based organization, multi-select checkboxes, bulk actions toolbar
- **Calendar/Schedule:** Week view for nutrition plans, day cards with meal slots

### Modals & Overlays
- **Modal Sizes:** sm (400px), md (600px), lg (800px) for forms/details
- **Confirmation Dialogs:** Centered, clear action buttons, explain consequences
- **Side Panels:** Slide from right for quick edits (768px width)

## Dashboard Sections

### 1. User Management
- Table view with search, filters (role, status)
- Inline quick actions, bulk operations
- User detail modal with activity history

### 2. Huddle Manager
- Upcoming huddle card with prominent countdown
- Schedule calendar with create huddle button
- Past huddles list with attendance stats

### 3. Nutrition Hub
- Tabs: Daily Plans | Weekly Schedules | Training Videos
- Drag-drop meal planning interface
- Video library with filtering by category/duration

### 4. Home Settings
- Live preview panel + widget inventory
- Drag widgets from inventory to layout zones
- Save/Reset buttons with confirmation

### 5. Weight Room
- Collection cards (grid layout)
- Video management table
- Exercise categorization system

## Animations

**Minimal, Purposeful Only:**
- Hover states: opacity/background transitions (150ms)
- Modal entry: fade + scale (200ms)
- Drag operations: transform feedback
- No scroll animations or decorative effects

## Images

**No hero image required** - this is a utility dashboard, not marketing.

**Image Usage:**
- User avatars (circular, 40px default)
- Video thumbnails (16:9 ratio, generated from video or uploaded)
- Exercise demonstration stills in weight room collections
- Empty state illustrations (simple, single-color line art)

All images should be optimized, lazy-loaded, with alt text for accessibility.