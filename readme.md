# README

## Request default

- Postgre 16
- python 3.11
- node js 10.2.5

## Windows

### config env and install module

> npm install
> change .env
> mkdir daftar_surat
> mkdir template_surat
> pip install -r requirements.txt

#### secret key

for install secret_key:

> node
> require('crypto').randomBytes(64).toString('hex')

#### python: v3.11

pytesseract 0.3.10
opencv-python 4.9.0.80
PyMuPDF 1.23.16
PyMuPDFb 1.23.9

### Database manager

#### production

> npx sequelize-cli db:create
> npx sequelize-cli db:migrate
> npx sequelize-cli db:seed:all

#### development

> npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string
> npx sequelize-cli db:drop
> npx sequelize-cli db:migrate:undo --name nama-file-migrasi.js
> npx sequelize-cli db:seed:undo --seed nama-file-migrasi.js

### Start server

#### pm2

> pm2 start npm --name "my-app" -- start
> pm2 delete "my-app"

#### forever

> forever start index.js
> forever list
> tail -f path/.forever/jypW.log
> forever logs
> forever stop 0

## linux

same like windows, but add more req

### setting python

create python venv:

> https://www.linuxcapable.com/how-to-install-python-3-11-on-ubuntu-linux/
> sudo add-apt-repository ppa:deadsnakes/ppa -y
> sudo apt install python3.11
> sudo apt install python3.11-venv
> python3.11 -m venv venv
> source venv/bin/activate
> pip install -r req
> disable teseract cli in script.py line 13
> pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

## run dev

> npm run start
