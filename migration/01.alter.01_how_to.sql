-- When deploying a new version, existing data must not be deleted.
-- However, we may want to change the structure of some tables (new columns).

-- Previous behavior :
-- dump1 -> drop -> /sql -> restore dump1

-- New bevior :
-- dump1 -> /migration -> dump2 -> drop -> /sql -> /migration -> restore dump2

-- Exemple 1 : If the table does not exist, only add it in /sql
-- Exemple 2 : If the table exist and I want to add a new column : do not change CREATE table in /sql. Instead, add ALTER TABLE ADD COLUMN in /migration.
