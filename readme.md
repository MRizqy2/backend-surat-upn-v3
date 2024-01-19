npm install

change the 'config.json' and .env

npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo --name nama-file-migrasi.js
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo --seed nama-file-migrasi.js

> npm run api-service//iyo kik

for install secret_key:

> node
> require('crypto').randomBytes(64).toString('hex')
