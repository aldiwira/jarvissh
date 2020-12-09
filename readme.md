### Remote Server Karo Chatbot

Rename dulu .env.example ke .env.
Sesuaikan isinya

### Petunjuk Migrasi sqlite3

1. Development

   npx knex migrate:up --env development
   npx knex seed:run --env development

2. Production

   npx knex migrate:up --env production
   npx knex seed:run --env production
