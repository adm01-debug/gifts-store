CREATE TABLE IF NOT EXISTS entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  version_number INT NOT NULL,
  data JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  change_summary TEXT,
  CONSTRAINT unique_version UNIQUE (entity_type, entity_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_versions_entity ON entity_versions(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_versions_date ON entity_versions(changed_at DESC);

ALTER TABLE entity_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view versions" ON entity_versions FOR SELECT USING (true);
