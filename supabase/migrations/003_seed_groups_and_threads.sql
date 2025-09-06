-- Seed groups table
INSERT INTO groups
 (id, name, description, members, is_public, activity, created_at, owner, members_list)
VALUES
 (gen_random_uuid(), 'Tech Society', 'A group for tech enthusiasts to collaborate, learn, and innovate on campus.', 24, true, 80, '2023-09-01', 'Anele M.', '[{"name":"Anele M.","role":"President"},{"name":"Thandi S.","role":"Treasurer"},{"name":"Sipho N.","role":"Member"},{"name":"Lebo D.","role":"Member"},{"name":"Sam K.","role":"Member"}]'),
 (gen_random_uuid(), 'Law Council', 'The official council for law students, organizing events and advocacy.', 12, false, 65, '2023-08-15', 'Thandi S.', '[{"name":"Thandi S.","role":"Chair"},{"name":"Sipho N.","role":"Secretary"},{"name":"Lebo D.","role":"Member"}]'),
 (gen_random_uuid(), 'Green Campus Initiative', 'Promoting sustainability and green practices across campus.', 18, true, 72, '2023-07-20', 'Sipho N.', '[{"name":"Sipho N.","role":"Coordinator"},{"name":"Anele M.","role":"Member"},{"name":"Thandi S.","role":"Member"}]'),
 (gen_random_uuid(), 'Art Collective', 'A creative space for artists to share, exhibit, and collaborate.', 15, false, 60, '2023-06-10', 'Lebo D.', '[{"name":"Lebo D.","role":"Lead Artist"},{"name":"Sam K.","role":"Curator"},{"name":"Thandi S.","role":"Member"}]'),
 (gen_random_uuid(), 'Entrepreneurship Hub', 'Supporting student startups and entrepreneurial projects.', 30, true, 90, '2023-05-05', 'Sam K.', '[{"name":"Sam K.","role":"Founder"},{"name":"Anele M.","role":"Co-Founder"},{"name":"Sipho N.","role":"Member"}]');

-- Seed threads table
INSERT INTO threads
 (id, group_id, creator_id, title, description, status, created_at, deadline, votes, total_members, comments)
VALUES
 (gen_random_uuid(), (SELECT id
  FROM groups
  WHERE name = 'Tech Society'
LIMIT 1), gen_random_uuid
(), 'Spring Festival Proposal', 'Should we host a Spring Festival this year? All members are invited to vote and discuss.', 'Open', '2024-06-01', '2024-06-15', '{"yes":18,"no":6}', 24, '[{"userId":"u1","text":"Great idea! Let''s do it."},{"userId":"u2","text":"Will we have enough budget?"}]'),
(gen_random_uuid
(),
(SELECT id
FROM groups
WHERE name = 'Tech Society'
LIMIT 1), gen_random_uuid
(), 'Budget Approval', 'Approve the annual budget for Tech Society.', 'Closed', '2024-05-10', '2024-05-20', '{"yes":10,"no":2}', 12, '[{"userId":"u3","text":"Budget looks good!"}]'),
(gen_random_uuid
(),
(SELECT id
FROM groups
WHERE name = 'Law Council'
LIMIT 1), gen_random_uuid
(), 'Law Symposium', 'Should we organize a law symposium this semester?', 'Open', '2024-04-01', '2024-04-15', '{"yes":8,"no":4}', 12, '[{"userId":"u2","text":"We need more details."}]'),
(gen_random_uuid
(),
(SELECT id
FROM groups
WHERE name = 'Green Campus Initiative'
LIMIT 1), gen_random_uuid
(), 'Recycling Drive', 'Proposal to start a campus-wide recycling drive.', 'Open', '2024-03-01', '2024-03-10', '{"yes":15,"no":3}', 18, '[{"userId":"u1","text":"I support this!"}]'),
(gen_random_uuid
(),
(SELECT id
FROM groups
WHERE name = 'Art Collective'
LIMIT 1), gen_random_uuid
(), 'Art Exhibition', 'Should we host an art exhibition in May?', 'Closed', '2024-02-01', '2024-02-20', '{"yes":12,"no":3}', 15, '[{"userId":"u4","text":"Let''s showcase our talent!"}]');
