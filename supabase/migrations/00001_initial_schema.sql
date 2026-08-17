-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Table: global_custom_columns
CREATE TABLE IF NOT EXISTS global_custom_columns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    column_name TEXT NOT NULL,
    column_type TEXT NOT NULL CHECK (column_type IN ('text', 'number', 'date', 'boolean')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table: animals
CREATE TABLE IF NOT EXISTS animals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    caravana_number TEXT UNIQUE NOT NULL,
    birth_date DATE,
    weight_birth NUMERIC,
    weight_weaning NUMERIC,
    weight_15_20_months NUMERIC,
    observations TEXT,
    genealogy JSONB NOT NULL DEFAULT '{"pelaje_padre": "", "pelaje_madre": "", "pelaje_abuelo": "", "genetica": ""}'::jsonb,
    health_data JSONB DEFAULT '{}'::jsonb,
    custom_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast caravana lookups
CREATE INDEX IF NOT EXISTS idx_animals_caravana ON animals(caravana_number);

-- 3. Table: weights
CREATE TABLE IF NOT EXISTS weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    weight_kg NUMERIC NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up weights by animal efficiently
CREATE INDEX IF NOT EXISTS idx_weights_animal_id ON weights(animal_id);

-- 4. Table: vaccines
CREATE TABLE IF NOT EXISTS vaccines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    applied BOOLEAN NOT NULL DEFAULT FALSE,
    vaccine_type TEXT,
    applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up vaccines by animal
CREATE INDEX IF NOT EXISTS idx_vaccines_animal_id ON vaccines(animal_id);

-- Function to automatically update the 'updated_at' column
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for 'updated_at'
CREATE TRIGGER trg_animals_updated_at
BEFORE UPDATE ON animals
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER trg_custom_columns_updated_at
BEFORE UPDATE ON global_custom_columns
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Setup Row Level Security (RLS)
-- The user requested open access for direct usage via anon key.
ALTER TABLE global_custom_columns ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (since no auth is required for now)
CREATE POLICY "Enable all operations for anon on global_custom_columns"
ON global_custom_columns FOR ALL
USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon on animals"
ON animals FOR ALL
USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon on weights"
ON weights FOR ALL
USING (true) WITH CHECK (true);

CREATE POLICY "Enable all operations for anon on vaccines"
ON vaccines FOR ALL
USING (true) WITH CHECK (true);
