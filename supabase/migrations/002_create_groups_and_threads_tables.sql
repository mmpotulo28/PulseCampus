-- Corrected groups table with org_id
CREATE TABLE
IF NOT EXISTS groups
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    org_id uuid NOT NULL, -- Organization ID
    name text NOT NULL,
    description text,
    members integer DEFAULT 0,
    is_public boolean DEFAULT true,
    activity integer DEFAULT 0,
    created_at timestamptz DEFAULT now
(),
    owner text,
    members_list jsonb DEFAULT '[]'::jsonb
);

-- Corrected threads table (group_id already present)
CREATE TABLE
IF NOT EXISTS threads
(
    id uuid PRIMARY KEY DEFAULT gen_random_uuid
(),
    group_id uuid REFERENCES groups
(id) ON
DELETE CASCADE,
    creator_id uuid,
    title text
NOT NULL,
    description text,
    status text DEFAULT 'Open',
    created_at timestamptz DEFAULT now
(),
    deadline timestamptz,
    votes jsonb DEFAULT '{}'::jsonb,
    total_members integer DEFAULT 0,
    comments jsonb DEFAULT '[]'::jsonb
);

-- Enable RLS (already present, kept for completeness)
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;

-- Read‑only policies for anon
CREATE POLICY "Allow read for anon" ON groups
    FOR
SELECT TO anon
USING
(true);

CREATE POLICY "Allow read for anon" ON threads
    FOR
SELECT TO anon
USING
(true);

-- Insert / update policies for authenticated users
CREATE POLICY "Allow insert for authenticated" ON groups
    FOR
INSERT TO authenticated
    WITH CHECK (
auth.uid()
IS NOT NULL);

CREATE POLICY "Allow update for authenticated" ON groups
    FOR
UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL);


-- Insert policy for authenticated users on threads
CREATE POLICY "Allow insert for authenticated" ON threads
    FOR
INSERT TO authenticated
    WITH CHECK (
auth.uid()
IS NOT NULL);

-- Update policy for authenticated users on threads
CREATE POLICY "Allow update for authenticated" ON threads
    FOR
UPDATE TO authenticated
    USING (auth.uid() IS NOT NULL);