create table
if not exists public.threads
(
	id uuid not null default gen_random_uuid
(),
	group_id uuid null,
	creator_id character varying null,
	title text not null,
	description text null,
	status text null default 'Open',
	created_at timestamp
with time zone null default now
(),
	deadline timestamp
with time zone null,
	total_members integer null default 0,
	vote_type text not null default 'yesno',
	constraint threads_pkey primary key
(id),
	constraint threads_group_id_fkey foreign key
(group_id) references groups
(id) on
delete cascade
);
