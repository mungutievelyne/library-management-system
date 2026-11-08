
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const genres = [
    {
      name: 'Fiction',
      description: 'Imaginative stories and novels.',
    },
    {
      name: 'Science',
      description: 'Books about scientific discoveries and knowledge.',
    },
    {
      name: 'Technology',
      description: 'Books about computers, programming and innovation.',
    },
    {
      name: 'History',
      description: 'Books about historical events and civilizations.',
    },
  ]

  // Create genres
  const createdGenres = await Promise.all(
    genres.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: { description: genre.description },
        create: genre,
      }),
    ),
  )

  const genreMap = Object.fromEntries(
    createdGenres.map((genre) => [genre.name, genre.id]),
  )

  const books = [
    // Fiction
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780435905255', genre: 'Fiction' },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', genre: 'Fiction' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518', genre: 'Fiction' },
    { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780062315007', genre: 'Fiction' },

    // Science
    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', genre: 'Science' },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9780345539434', genre: 'Science' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', genre: 'Science' },
    { title: 'Silent Spring', author: 'Rachel Carson', isbn: '9780618249060', genre: 'Science' },

    // Technology
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', genre: 'Technology' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '9780135957059', genre: 'Technology' },
    { title: 'Code', author: 'Charles Petzold', isbn: '9780735611313', genre: 'Technology' },
    { title: 'Design Patterns', author: 'Erich Gamma', isbn: '9780201633610', genre: 'Technology' },

    // History
    { title: 'Sapiens', author: 'Yuval Noah Harari', isbn: '9780062316097', genre: 'History' },
    { title: 'The Diary of a Young Girl', author: 'Anne Frank', isbn: '9780553296983', genre: 'History' },
    { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', isbn: '9780393354324', genre: 'History' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', genre: 'History' },
  ]

  // Create books and connect each to its genre
  for (const book of books) {
    const { genre, ...bookData } = book

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genreId: genreMap[genre],
      },
      create: {
        ...bookData,
        genre: {
          connect: { id: genreMap[genre] },
        },
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log(`Genres created: ${createdGenres.length}`)
  console.log(`Books processed: ${books.length}`)
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
