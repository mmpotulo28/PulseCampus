create table
if not exists nominations
(
	id uuid default gen_random_uuid
() primary key,
	thread_id text not null,
	name text not null,
	user_id text,
	email text,
	label text not null,
	created_at timestamptz default now
()
);

create index
if not exists idx_nominations_thread_id on nominations
(thread_id);

grant select, insert, update, delete on table nominations to anon;
grant select, insert, update, delete on table nominations to authenticated;
