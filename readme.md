npm install
change the 'config.json' and .env
mkdir daftar_surat
mkdir template_surat

npx sequelize-cli db:create
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo --name nama-file-migrasi.js
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
npx sequelize-cli db:seed:all
npx sequelize-cli db:seed:undo --seed nama-file-migrasi.js

> npm run api-service
> forever start index.js
> forever list
> tail -f path/.forever/jypW.log

> forever logs
> forever stop 0

for install secret_key:

<!-- secret key -->

> node
> require('crypto').randomBytes(64).toString('hex')

> pip install -r requirements.txt

`python: v3.11`

pytesseract 0.3.10
opencv-python 4.9.0.80
PyMuPDF 1.23.16
PyMuPDFb 1.23.9
