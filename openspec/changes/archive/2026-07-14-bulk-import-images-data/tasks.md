## 1. Setup Script

- [x] 1.1 Create `scripts/bulk-import.js` to serve as the main coordination script.
- [x] 1.2 Import necessary modules (`fs`, `path`, `child_process`).

## 2. R2 Storage Preparation and Upload

- [x] 2.1 Add functionality to clear existing objects in `gallery-images` R2 bucket using `wrangler r2 object delete` (or simply overwrite existing to save time if clearing is unnecessary).
- [x] 2.2 Add a loop to read `public/images/` directory.
- [x] 2.3 Execute `wrangler r2 object put` for each `.png` and `.jpg` file found in the directory to upload to `gallery-images`.

## 3. Data Processing and D1 Insertion

- [x] 3.1 Read and parse `public/images/image_data.csv`.
- [x] 3.2 Extract row data (`New_Filename`, `Country_Code`, `Serial_Number`, `Value`, `Quality`) and map it into SQL format.
- [x] 3.3 Generate a `DELETE FROM items;` statement followed by `INSERT INTO items (highResUrl, thumbnailUrl, title, description, value, country) VALUES (...)` statements and save to `scripts/seed.sql`.
- [x] 3.4 Execute the generated `seed.sql` against the remote `gallery-db` database using `npx wrangler d1 execute gallery-db --remote --file=scripts/seed.sql`.
