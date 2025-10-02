create table
if not exists nominations
(
	id uuid default gen_random_uuid
() primary key,
	threadId text not null,
	name text not null,
	userId text,
	email text,
	label text not null,
	createdAt timestamptz default now
()
);

create index
if not exists idx_nominations_threadId on nominations
(threadId);

grant select, insert, update, delete on table nominations to anon;
grant select, insert, update, delete on table nominations to authenticated;
