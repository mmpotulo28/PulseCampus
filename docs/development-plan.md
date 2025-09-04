# PulseCampus Development Plan

This document outlines the technical roadmap for building PulseCampus, mapping PRD requirements to concrete deliverables.

---

## 1. Pages

- `/` — Landing Page (features, pricing, testimonials, CTA, FAQ)
- `/signup` — Registration (Clerk integration, role selection)
- `/login` — Login (Clerk)
- `/dashboard` — User dashboard (groups, threads, metrics)
- `/groups/[groupId]` — Group details, branding, member management
- `/threads/[threadId]` — Decision threads, proposals, voting, comments
- `/profile` — User profile management
- `/admin` — Admin dashboard (for campus plan)
- `/settings` — Account and group settings
- `/export` — Export logs (CSV/PDF, paid users)
- `/404` — Custom not found

---

## 2. Components

- **Navbar** — Responsive, role-aware navigation
- **Footer** — Branding, links, social
- **HeroSection** — Animated intro
- **FeaturesSection** — Feature cards with icons
- **PricingSection** — Tiered pricing cards
- **TestimonialsSection** — Student feedback
- **FAQSection** — Accordion-based Q&A
- **CallToActionSection** — Signup prompt
- **GroupCard** — Group summary, branding
- **ThreadCard** — Proposal summary, status
- **VoteWidget** — Voting UI (Yes/No, MCQ, Ranked)
- **CommentThread** — Threaded comments, emoji reactions
- **PulseScore** — Engagement metric display
- **Heatmap** — Voting activity visualization
- **NotificationBell** — Alerts, reminders
- **ExportButton** — Download logs
- **RoleBadge** — User role indicator
- **ProfileForm** — Edit profile
- **BrandingForm** — Custom logo/colors (paid)
- **AdminPanel** — Campus plan features

---

## 3. Functionality

- **Authentication**

    - Clerk integration (email/password, OAuth, university domain filtering)
    - Email verification
    - Role assignment on signup (Admin, Moderator, Member, Observer)
    - Route protection by role

- **Group Management**

    - Create/manage groups
    - Invite members via email
    - Assign roles/permissions
    - Custom branding for paid tiers

- **Decision Threads**

    - Create proposals (title, description, deadline, attachments)
    - Markdown formatting
    - Threaded comments, emoji reactions

- **Voting System**

    - Real-time voting (Supabase)
    - Voting types: Yes/No, Multiple Choice, Ranked
    - Anonymous voting option
    - Weighted voting (role/tenure)
    - Consensus detection algorithm

- **Engagement Metrics**

    - Pulse Score calculation
    - Heatmap of voting activity
    - Member engagement dashboard

- **Notifications**

    - Email and in-app alerts (new proposals, votes, comments)
    - Reminder nudges before deadlines

- **Audit & History**

    - Decision archive with timestamps
    - Exportable logs (CSV/PDF for paid users)
    - Comment and vote history per thread

- **Billing**
    - Stripe integration for paid tiers
    - Subscription management

---

## 4. Hooks & Contexts

- `useAuth` — User authentication, role, session
- `useGroup` — Group data, permissions, branding
- `useThread` — Thread data, voting, comments
- `useVote` — Voting logic, consensus detection
- `usePulseScore` — Engagement calculation
- `useNotifications` — Alerts, reminders
- `useBilling` — Subscription status, payment
- `useExport` — Export logs
- `useTheme` — Dark/light mode

- **Contexts**
    - `AuthContext` — User, role, session
    - `GroupContext` — Current group, permissions
    - `NotificationContext` — Alerts, reminders
    - `BillingContext` — Subscription info

---

## 5. Authentication & Roles

- Clerk for auth and user management
- Roles: Admin, Moderator, Member, Observer
- Role-based access control for routes and UI
- Campus plan: additional admin/faculty roles

---

## 6. State Management

- React Context for global state (auth, group, notifications)
- Supabase for real-time data (votes, threads)
- Local state for UI interactions

---

## 7. Testing & QA

- Unit tests for voting logic, consensus engine
- Integration tests for Supabase/Clerk flows
- Manual QA for UI/UX
- Load testing for voting periods

---

## 8. Deployment & DevOps

- Next.js on Vercel/Heroku
- Supabase backend
- Clerk for auth
- Stripe for billing
- CI/CD pipeline (lint, test, build, deploy)

---

## 9. Timeline & Milestones

- Week 1: Project setup, auth integration
- Week 2: Group creation, role management
- Week 3: Decision threads, voting logic
- Week 4: Real-time sync, engagement metrics
- Week 5: Notifications, audit logs
- Week 6: Export features, admin dashboard
- Week 7: Stripe billing setup
- Week 8: Final QA, deployment

---

## 10. Future Features

- AI-powered decision summaries
- Mobile app (React Native/Expo)
- Sentiment analysis on comments
- Gamified engagement (badges, streaks)
- LMS integration

---

**This plan ensures all PRD requirements are mapped to technical deliverables for a robust, scalable PulseCampus platform.**
