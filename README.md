
## Schema Decisions

The library database uses a relational data model with Prisma and PostgreSQL.

### Why Book References Genre

Each Book has a `genreId` foreign key that references the Genre model instead of storing the genre name and description directly inside the Book model.

This design was chosen because:

- **Reduces data duplication:** Genre information is stored once rather than repeated across multiple books.
- **Maintains consistency:** Updating a genre name or description in one place keeps the information consistent.
- **Supports relationships:** One Genre can have many Books, while each Book belongs to one Genre.
- **Improves data integrity:** The foreign key ensures that a book references an existing genre.

### User Roles

The User model uses a Role enum with two allowed values: `PATRON` and `LIBRARIAN`. This prevents arbitrary role values from being stored.

### Database Choice

PostgreSQL was selected as the relational database because the library system contains structured data and relationships between users, books and genres. Prisma provides type-safe database access and schema management.
