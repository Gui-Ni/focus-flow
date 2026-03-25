# Focus Flow

A productivity dashboard with immersive interaction modes designed to help users achieve flow state.

## 🎯 Core Concept

Focus Flow transforms productivity into an **immersive experience** with unique interaction modes:
- ⚡ **精神充能 (Recharge)** - 向内收集，收束聚焦
- 💫 **灵感触发 (Inspiration)** - 向外扩散，跳跃触发

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | TailwindCSS v4 |
| Animation | Framer Motion |
| Database | Supabase (PostgreSQL) |
| Auth | NextAuth.js (Google + Email) |
| Payments | LemonSqueezy |
| Email | Resend |
| Deployment | Vercel |

## 📁 Project Structure

```
focus-flow/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── (auth)/       # Auth pages (login, signup)
│   │   ├── (dashboard)/  # Protected app pages
│   │   │   └── app/      # Main dashboard
│   │   ├── api/          # API routes
│   │   ├── blog/         # Blog pages
│   │   └── store/        # Store pages
│   ├── components/       # React components
│   │   ├── ui/           # UI primitives
│   │   └── features/     # Feature components
│   ├── lib/              # Utilities
│   │   ├── supabase/     # Supabase client
│   │   └── utils/        # Helper functions
│   └── types/            # TypeScript types
├── public/               # Static assets
└── ...config files
```

## 🚀 Getting Started

### 1. Clone and Install

```bash
cd focus-flow
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env.local
```

Fill in your credentials:
- Supabase project URL and keys
- Google OAuth credentials
- LemonSqueezy API key

### 3. Setup Database

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase/schema.sql`
3. Enable Email and Google auth in Supabase dashboard

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Database Schema

### Users Table
- `id` (UUID, primary key)
- `email` (text)
- `name` (text)
- `avatar_url` (text, nullable)
- `subscription_status` (enum: free, pro, cancelled)
- `subscription_id` (text, nullable)
- `created_at` (timestamp)

### Focus Sessions Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `mode` (enum: recharge, inspiration, pomodoro)
- `duration_minutes` (integer)
- `completed_at` (timestamp)

### Tasks Table
- `id` (UUID, primary key)
- `user_id` (UUID, foreign key)
- `title` (text)
- `priority` (integer)
- `completed` (boolean)
- `created_at` (timestamp)

## 🔐 Authentication

Uses NextAuth.js with:
- Google OAuth (recommended)
- Email magic link (fallback)

## 💳 Payments

Subscriptions managed via LemonSqueezy:
- **Free**: Basic features
- **Pro ($9/month)**: All modes, themes, analytics

## 📦 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual

```bash
npm run build
npm start
```

## 📄 License

Private - All rights reserved
