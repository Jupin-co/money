## Context

The system currently has an empty or dummy D1 database and R2 bucket. We have over 200 images stored locally in `public/images/` and a corresponding `image_data.csv` file mapping filenames to item metadata. We need a reliable, automated way to import this data into Cloudflare's platform for production use. 

## Goals / Non-Goals

**Goals:**
- Provide a Node.js script to automate cleaning the `items` table in D1 and the `gallery-images` bucket in R2.
- Upload all files from `public/images/` to the R2 bucket.
- Parse `image_data.csv` to extract relevant fields (`New_Filename`, `Country_Code`, `Serial_Number`, `Value`, `Quality`).
- Map these fields to generate `INSERT` statements for the D1 database.
- Execute the database updates seamlessly.

**Non-Goals:**
- Image resizing or format conversion (we assume the images are already properly prepared).
- Preserving existing data (this is a destructive wipe-and-load operation).

## Decisions

- **Tooling:** We will create a Node.js script `scripts/bulk-import.js` to coordinate the tasks.
- **Database Insertion:** The script will parse the CSV and generate a single `seed.sql` file containing all `INSERT INTO items` statements. It will then execute `npx wrangler d1 execute gallery-db --remote --file=seed.sql`.
- **R2 Uploads:** The script will use the `wrangler r2 object put` CLI command in a loop to upload the images. This avoids needing AWS SDK credentials and relies on the existing authenticated wrangler session.
- **Schema Mapping:**
  - `New_Filename` -> `highResUrl` and `thumbnailUrl` (since we just have one image per item for now, we'll use it for both, prefixed by the R2 public URL).
  - `Country_Code` -> `country`
  - `Serial_Number` -> `title` / `description`
  - `Value` -> `value`
  - `Quality` -> mapped into description or ignored depending on the schema.

## Risks / Trade-offs

- **Risk:** Rate limiting or execution timeouts from Cloudflare when calling `wrangler r2 object put` 200+ times sequentially.
  - **Mitigation:** The script will execute the uploads sequentially with logging to monitor progress, rather than in parallel, to avoid overwhelming the CLI or local system resources.
- **Risk:** Deleting existing data destroys any manually added records.
  - **Mitigation:** This is explicitly understood as a bootstrapping step. We will truncate the table rather than dropping it to preserve schema.
