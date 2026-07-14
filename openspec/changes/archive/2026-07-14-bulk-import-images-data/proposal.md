## Why

The current D1 database and R2 bucket contain placeholder or outdated initial data. To populate the gallery application with a real, extensive collection of items, we need a reliable way to bulk-import data. This change will clean the existing databases, upload all production images to R2, and parse a provided CSV file (`image_data.csv`) to automatically generate and insert the corresponding rows into the D1 database.

## What Changes

- **BREAKING**: Existing data in the `items` table of the `gallery-db` D1 database will be truncated (deleted).
- **BREAKING**: Existing objects in the `gallery-images` R2 bucket will be deleted to ensure a clean state.
- Create a script to iterate over `public/images/` and upload all images to the `gallery-images` R2 bucket.
- Create a script to parse `public/images/image_data.csv`, extract `Country_Code`, `Serial_Number`, `Value`, and `Quality`, and combine them with the generated R2 URLs to create SQL insert statements.
- Execute the SQL insert statements against the Cloudflare D1 database.

## Capabilities

### New Capabilities
- `bulk-data-import`: A capability to securely clear existing D1/R2 storage, batch upload local images to an R2 bucket via the AWS S3 API, and parse a local CSV file to generate and execute D1 SQL insert statements.

### Modified Capabilities

## Impact

- **Cloudflare R2**: The `gallery-images` bucket will be wiped and repopulated.
- **Cloudflare D1**: The `gallery-db` database `items` table will be wiped and repopulated.
- **Scripts**: A new Node.js script will be added to the repository for automating this process.
