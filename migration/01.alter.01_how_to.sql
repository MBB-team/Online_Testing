-- When deploying a new version, existing data must not be deleted.
-- However, we may want to change the structure of some tables (new columns).

-- At each deployment, each file of /migration is executed :
-- dump1 -> /migration -> dump2 -> git pull; docker-compose restart; -> restore dump2

-- Exemple : If the table exist and I want to add a new column : do not change CREATE table in /sql. Instead, add ALTER TABLE ADD COLUMN in /migration.
