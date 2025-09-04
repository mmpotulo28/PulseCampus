## Inspiration

As a university student deeply involved in both tech and legal studies, I noticed a recurring problem: student organizations struggle with decision-making. Meetings are often poorly attended, votes are scattered across platforms, and transparency is lacking. I wanted to build something that empowers student voices and brings structure to campus collaboration — a tool that feels intuitive, inclusive, and scalable.

## What it does

PulseCampus is a real-time decision-making and engagement platform designed for student councils, clubs, and societies. It allows users to:

- Create proposals and threaded discussions
- Vote anonymously or with weighted input
- Track engagement through metrics like Pulse Score
- View decision history and export audit logs
- Authenticate securely using university email domains

The platform is built as a SaaS app, with tiered subscriptions for student groups and campus-wide licensing options for universities.

## How we built it

We used a modern, scalable stack:

- Frontend: Built with Next.js for fast rendering and dynamic routing
- Backend: Hosted on Heroku, handling background jobs and webhook processing
- Database: Supabase powers real-time voting, threads, and audit logs
- Authentication & Billing: Clerk manages user roles, email verification, and Stripe-based subscriptions
- UI: Styled with HeroUI and TailwindCSS for a clean, responsive interface

The architecture supports real-time sync, role-based access, and future expansion into mobile and AI-powered features.

## Challenges we ran into

- Consensus Logic: Designing a smart algorithm that detects consensus based on engagement and agreement was more complex than expected. We explored models like:
  $$ C = \frac{E \cdot A}{T} $$
  where \( C \) is consensus score, \( E \) is engagement rate, \( A \) is agreement percentage, and \( T \) is total members.

- Role Management: Integrating Clerk’s role-based access with Supabase’s row-level security required careful schema planning.

- Realtime Sync: Ensuring smooth updates across threads and votes without lag pushed us to optimize Supabase listeners and debounce logic.

- Design Balance: Making the platform feel “student-friendly” while retaining professional-grade features was a constant UX challenge.

## Accomplishments that we're proud of

- Built a fully functional MVP in under 2 weeks
- Designed a scalable SaaS model with monetization baked in
- Created a unique consensus engine tailored for student governance
- Developed a clean, responsive UI that works across devices
- Integrated secure auth and billing with minimal friction

## What we learned

- How to architect a real-time SaaS platform using Supabase and Clerk
- The importance of user roles and permissions in collaborative apps
- How to balance technical ambition with usability
- That even simple voting systems can have complex social dynamics
- How to pitch and package a product for both hackathons and real-world deployment
