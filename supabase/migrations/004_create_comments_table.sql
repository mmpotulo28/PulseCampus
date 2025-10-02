CREATE TABLE
IF NOT EXISTS comments
(
	id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
	threadId uuid NOT NULL REFERENCES threads
(id) ON
DELETE CASCADE,
	userId uuid
NOT NULL,
	text text NOT NULL,
	createdAt timestamptz DEFAULT now
()
);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for anon" ON comments
	FOR
SELECT
	USING (true);

CREATE POLICY "Allow insert for authenticated" ON comments
	FOR
INSERT
	WITH CHECK (auth.uid() IS NOT NULL)
;

CREATE POLICY "Allow update for authenticated" ON comments
	FOR
UPDATE
	USING (auth.uid()
IS NOT NULL);

CREATE POLICY "Allow delete for authenticated" ON comments
	FOR
DELETE
	USING (auth.uid
() IS NOT NULL);
