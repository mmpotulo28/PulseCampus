-- Create the pulse schema if it doesn't exist
create schema
if not exists pulse;

-- Create the votes table in the pulse schema
create table
if not exists pulse.votes
(
	id uuid default gen_random_uuid
() primary key,
	threadId text not null,
	userId text,
	vote text not null,
	weight float default 1,
	created_at timestamptz default now
()
);

-- Index for real-time updates
create index
if not exists idx_votes_threadId on pulse.votes
(threadId);

-- Grant full access to postgres and neon
grant all privileges on table pulse.votes to postgres;
grant all privileges on table pulse.votes to neon;

-- Grant full permissions to anon role (used by Supabase anon key)
grant select, insert, update, delete on table pulse.votes to anon;
grant usage on schema pulse to anon;
create index
if not exists idx_votes_threadId on pulse.votes
(threadId);

-- Grant full access to postgres and neon
grant all privileges on table pulse.votes to postgres;
grant all privileges on table pulse.votes to neon;
