# PulseCampus – Smart Decision-Making & Engagement Platform for Student Organizations

**Type:** SaaS Web Application
**Target Audience:** University student councils, clubs, societies, residence committees
**Tech Stack:** Supabase, Next.js, Clerk, Heroku

---

## 1. 🎯 Project Overview

**Objective:**
Create a centralized platform for student groups to propose initiatives, vote transparently, discuss ideas, and track engagement in real time.

**Goals:**

- Increase student participation in decision-making
- Provide transparency and accountability
- Offer a scalable SaaS model for monetization

---

## 2. 🧩 Functional Requirements

### 2.1 User Management

- Authentication via Clerk (email/password, OAuth, university domain filtering)
- Roles: Admin, Moderator, Member, Observer
- Profile Management: Name, role, bio, group affiliation

### 2.2 Group & Organization Management

- Create/manage student groups
- Invite members via email
- Assign roles and permissions
- Custom branding (logo, colors) for paid tiers

### 2.3 Decision Threads

- Create proposals (title, description, deadline)
- Attach files or links
- Markdown support for formatting
- Threaded comments and emoji reactions

### 2.4 Voting System

- Real-time voting via Supabase
- Voting types: Yes/No, Multiple Choice, Ranked
- Optional anonymous voting
- Weighted voting (role or tenure)
- Consensus detection algorithm (e.g., 70% agreement + minimum engagement)

### 2.5 Engagement Metrics

- Pulse Score: % of members who participated
- Heatmap of voting activity
- Member engagement dashboard

### 2.6 Notifications

- Email and in-app alerts for proposals, votes, comments
- Reminder nudges before deadlines

### 2.7 Audit & History

- Decision archive with timestamps
- Exportable logs (CSV/PDF for paid users)
- Comment and vote history per thread

---

## 3. 🛠 Technical Requirements

### 3.1 Frontend (Next.js)

- Responsive design (mobile-first)
- Dynamic routing for groups and threads
- PWA support for offline access

### 3.2 Backend

- **Supabase:**
    - Realtime database for votes and threads
    - Auth fallback for Clerk
    - Storage for attachments
- **Heroku:**
    - Background jobs (consensus calculations, reminders)
    - Webhook processing for integrations

### 3.3 Authentication & Billing

- Clerk: Role-based access control
- Subscription management (Stripe integration)
- Email verification and domain filtering

---

## 4. 💰 Monetization Strategy

| Tier        | Features                                              | Price (Monthly) |
| ----------- | ----------------------------------------------------- | --------------- |
| Free        | Up to 10 members, basic voting, 3 decision threads    | $0              |
| Starter     | Unlimited members, custom branding, analytics, export | $9              |
| Pro         | Slack/Discord integration, advanced consensus, API    | $29             |
| Campus Plan | Bulk license, admin dashboard, faculty oversight      | Custom Pricing  |

---

## 5. 🧪 Testing & QA

- Unit tests for voting logic and consensus engine
- Integration tests for Supabase and Clerk flows
- Manual QA for UI/UX across devices
- Load testing for high-traffic voting periods

---

## 6. 📅 Development Timeline (MVP)

| Week | Milestone                               |
| ---- | --------------------------------------- |
| 1    | Project setup, auth integration (Clerk) |
| 2    | Group creation, role management         |
| 3    | Decision threads and voting logic       |
| 4    | Real-time sync with Supabase            |
| 5    | Notifications and engagement metrics    |
| 6    | Audit logs, export features             |
| 7    | Stripe billing setup                    |
| 8    | Final QA and deployment                 |

---

## 7. 📈 Future Features

- AI-powered decision summaries
- Mobile app (React Native or Expo)
- Sentiment analysis on comments
- Gamified engagement (badges, streaks)
- Integration with university LMS platforms
  8 Final QA and deployment

7. 📈 Future Features
   AI-powered decision summaries

Mobile app (React Native or Expo)

Sentiment analysis on comments

Gamified engagement (badges, streaks)

Integration with university LMS platforms
