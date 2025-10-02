create table
if not exists public.threads
(
	id uuid not null default gen_random_uuid
(),
	groupId uuid null,
	creatorId character varying null,
	title text not null,
	description text null,
	status text null default 'Open',
	createdAt timestamp
with time zone null default now
(),
	deadline timestamp
with time zone null,
	total_members integer null default 0,
	voteType text not null default 'yesno',
	constraint threads_pkey primary key
(id),
	constraint threads_groupId_fkey foreign key
(groupId) references groups
(id) on
delete cascade
);
