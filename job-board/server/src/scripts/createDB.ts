import { connection } from '../db/connection'

/**
 * @dev - This script will create the database and insert some data into it.
 * @notice - This script will drop the database if it already exists.
 */
const createDB = async () => {
  await connection.schema.dropTableIfExists('user')
  await connection.schema.dropTableIfExists('job')
  await connection.schema.dropTableIfExists('company')

  await connection.schema.createTable('company', (table) => {
    table.text('id').notNullable().primary()
    table.text('name').notNullable()
    table.text('description')
  })

  await connection.schema.createTable('job', (table) => {
    table.text('id').notNullable().primary()
    table.text('companyId').notNullable().references('id').inTable('company')
    table.text('title').notNullable()
    table.text('description')
    table.text('createdAt').notNullable()
  })

  await connection.schema.createTable('user', (table) => {
    table.text('id').notNullable().primary()
    table.text('companyId').notNullable().references('id').inTable('company')
    table.text('email').notNullable().unique()
    table.text('password').notNullable()
  })

  await connection.table('company').insert([
    {
      id: 'FjcJCHJALA4i',
      name: 'Facegle',
      description:
        'We are a startup on a mission to disrupt social search engines. Think Facebook meet Google.',
    },
    {
      id: 'Gu7QW9LcnF5d',
      name: 'Goobook',
      description:
        'We are a startup on a mission to disrupt search social media. Think Google meet Facebook.',
    },
  ])

  await connection.table('job').insert([
    {
      id: 'f3YzmnBZpK0o',
      companyId: 'FjcJCHJALA4i',
      title: 'Frontend Developer',
      description:
        'We are looking for a Frontend Developer familiar with React.',
      createdAt: '2023-01-26T11:00:00.000Z',
    },
    {
      id: 'XYZNJMXFax6n',
      companyId: 'FjcJCHJALA4i',
      title: 'Backend Developer',
      description:
        'We are looking for a Backend Developer familiar with Node.js and Express.',
      createdAt: '2023-01-27T11:00:00.000Z',
    },
    {
      id: '6mA05AZxvS1R',
      companyId: 'Gu7QW9LcnF5d',
      title: 'Full-Stack Developer',
      description:
        'We are looking for a Full-Stack Developer familiar with Node.js, Express, and React.',
      createdAt: '2023-01-30T11:00:00.000Z',
    },
  ])

  await connection.table('user').insert([
    {
      id: 'AcMJpL7b413Z',
      companyId: 'FjcJCHJALA4i',
      email: 'alice@facegle.io',
      password: 'alice123',
    },
    {
      id: 'BvBNW636Z89L',
      companyId: 'Gu7QW9LcnF5d',
      email: 'bob@goobook.co',
      password: 'bob123',
    },
  ])
}

createDB()
  .then(() => {
    console.log('Database created successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
