## Set up

Complete the following steps to start the swes-takehome-challenge:

1. Clone this repository to your local machine `git clone URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "swes-takehome-challenge",`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

## Creating and Seeding Databases

Using postgreSQL

1. Create db under whichever username you'd like, I chose `user` and named my databases `CoShared` and `CoShared-test`
2. Then run `npm run migrate` and `npm run migrate:test` to create the tables
3. To seed to tables run `psql -U user -d CoShared -f ./seeds/seed.coshared-tables.sql`
