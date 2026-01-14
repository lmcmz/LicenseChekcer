-- Create table for storing package license information
CREATE TABLE IF NOT EXISTS package_licenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_name TEXT NOT NULL,
  package_version TEXT NOT NULL,
  license_name TEXT,
  license_category TEXT,
  risk_level TEXT,
  commercial_use BOOLEAN,
  modification BOOLEAN,
  distribution BOOLEAN,
  patent_grant BOOLEAN,
  private_use BOOLEAN,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(package_name, package_version)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_package_licenses_name_version
ON package_licenses(package_name, package_version);

CREATE INDEX IF NOT EXISTS idx_package_licenses_created_at
ON package_licenses(created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_package_licenses_updated_at
BEFORE UPDATE ON package_licenses
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE package_licenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access"
ON package_licenses FOR SELECT
TO anon, authenticated
USING (true);

-- Create policy to allow authenticated insert
CREATE POLICY "Allow authenticated insert"
ON package_licenses FOR INSERT
TO authenticated
WITH CHECK (true);
