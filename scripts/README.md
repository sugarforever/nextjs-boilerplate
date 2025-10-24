# Database Scripts

This directory contains utility scripts for database management.

## make-admin.ts

Promotes a user to ADMIN role by email address.

### Usage

```bash
npm run make-admin <email>
```

### Example

```bash
npm run make-admin user@example.com
```

### Output

Success:
```
✅ Successfully promoted "user@example.com" to ADMIN
   Name: John Doe
   ID: clxxx...
   Role: ADMIN
```

Already admin:
```
✅ User "user@example.com" is already an admin
```

User not found:
```
❌ User with email "user@example.com" not found
```

### Requirements

- User must exist in the database
- Valid email address must be provided
- Database connection must be configured in `.env`

### Notes

- This script connects to your database using the `DATABASE_URL` environment variable
- The script will exit with status code 1 on errors
- Changes are immediately committed to the database
