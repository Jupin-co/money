## ADDED Requirements

### Requirement: Database Truncation
The script SHALL issue commands to truncate the `items` table in the D1 database to ensure a clean state before inserting new records.

#### Scenario: Running the import script
- **WHEN** the script is executed
- **THEN** it generates a `DELETE FROM items;` or similar command in the SQL seed file.

### Requirement: Bucket Purge
The script SHALL issue commands to delete all existing files in the `gallery-images` R2 bucket before uploading new images.

#### Scenario: Running the import script
- **WHEN** the script is executed
- **THEN** it executes `wrangler r2 object delete` for existing items (or relies on overwriting if deletion is too slow).

### Requirement: R2 Upload
The script SHALL iterate through `public/images/` and upload all image files to the `gallery-images` R2 bucket.

#### Scenario: Finding valid images
- **WHEN** the script finds a `.png` or `.jpg` file in `public/images/`
- **THEN** it executes a `wrangler r2 object put` command to upload that file.

### Requirement: CSV Parsing and SQL Generation
The script SHALL parse `public/images/image_data.csv` and map the fields `Country_Code`, `Serial_Number`, `Value`, `Quality`, and `New_Filename` to generate `INSERT` statements for the D1 database.

#### Scenario: Parsing a CSV row
- **WHEN** a row is parsed from the CSV
- **THEN** an `INSERT INTO items` statement is generated setting `highResUrl` and `thumbnailUrl` to point to the uploaded R2 image URL.

### Requirement: Execution
The script SHALL execute the generated SQL statements against the configured D1 database using wrangler.

#### Scenario: Completing the SQL generation
- **WHEN** the `seed.sql` file is fully written
- **THEN** the script calls `npx wrangler d1 execute gallery-db --remote --file=seed.sql`.
