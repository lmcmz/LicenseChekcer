-- Add ecosystem column
ALTER TABLE package_licenses ADD COLUMN IF NOT EXISTS ecosystem TEXT;

-- Drop unused boolean columns
ALTER TABLE package_licenses DROP COLUMN IF EXISTS commercial_use;
ALTER TABLE package_licenses DROP COLUMN IF EXISTS modification;
ALTER TABLE package_licenses DROP COLUMN IF EXISTS distribution;
ALTER TABLE package_licenses DROP COLUMN IF EXISTS patent_grant;
ALTER TABLE package_licenses DROP COLUMN IF EXISTS private_use;
ALTER TABLE package_licenses DROP COLUMN IF EXISTS license_category;

-- Drop old unique constraint
ALTER TABLE package_licenses DROP CONSTRAINT IF EXISTS package_licenses_package_name_package_version_key;

-- Add new composite unique constraint with ecosystem
ALTER TABLE package_licenses ADD CONSTRAINT package_licenses_ecosystem_name_version_key
UNIQUE(ecosystem, package_name, package_version);

-- Drop old index
DROP INDEX IF EXISTS idx_package_licenses_name_version;

-- Create new composite index
CREATE INDEX IF NOT EXISTS idx_package_licenses_ecosystem_name_version
ON package_licenses(ecosystem, package_name, package_version);

-- Create index for ecosystem lookups
CREATE INDEX IF NOT EXISTS idx_package_licenses_ecosystem
ON package_licenses(ecosystem);

-- Add NOT NULL constraint to ecosystem (after existing data is migrated)
-- Note: Run this after updating all existing records to have an ecosystem value
-- ALTER TABLE package_licenses ALTER COLUMN ecosystem SET NOT NULL;
