# Minka ZEF application

This repository is the solution backend and db service to this task:
https://gist.github.com/zrumenjak/dfbd960482918a5ac0edf65c7453a14a

## Summary

This project is a Node.Js express application with a sequelize generated model db. 
To start de the service, you need to start both the database with migrations and seed data as well as the express server to listen to requests.

The application can be started in the current envrionment or in a dockerized container, whichever you preffer.

Before anything run
```
npm install
```
To install all necesary dependencies.


## Docker install and run
###(Recommended)

To start the server in a dockerized container, first be sure to have docker installed and running in your environment.
then simply run
```
npm run docker:start:dev
```
to compose and start the docker container.
Once the process is finished, both the db and the app container will be created and you will find yourself in the containers console. Run 
```
npm run db:create:all
```
to run all migrations and seed data files.

After that just run
```
npm run start:dev
```
to start the server and start listening for requests.
You can also run 
```
npm run db:create:all:tests
npm run test
```
to create the tests database and run all tests.

## Non-docker install and run

If you dont want or do not have docker installed, you can run the project locally in the same way.
Basically the same, but without starting a docker container.
```
npm run db:create:all
npm run start:dev
```
or
```
npm run db:create:all:tests
npm run tests
```

## Tests

To run tests, be sure to run
```
npm run db:create:all:tests
```
to set up the test database. Then simply run
```
npm run test
```

There is also a postamn request collection to fully test and use the service under
./requests/ZEF_Requests_postmancollection.json

## Usser stories <-> Requests
| As a             | I want to                            | Request                                       |
| -----------------| ------------------------------------ | --------------------------------------------- |
| � Domain owner   | create a new  currency	              | POST /currencies                              |
| � Domain owner   | issue currency	                      | POST /accounts/transfer                        |
| � Member         | create an account                    | POST /accounts/create                          |
| � Member         | see my account balance               | GET /accounts                                 |
| � Member         | exchange currency                    | POST /projects/:projectId/invest               |
| � Member         | create a new currency                | POST /projects                                |
| � Member         | return currency to Domain owner      | POST /accounts/transfer
### Database config
Both .env files and sequelize ./src/db/config/config.json database HOST are setted for the Docker container environment.
If you want to run locally, simply change the paramenters to
```
DB_HOST=localhost
```
and 
```
"host"="localhost"
```
in each file. 
### Caveats

In case the database create all commands fails, there is the possibility to run the creation, migration and seed in separate singular commands like
```
npm run db:create
npm run db:migrate
npm run db:seed
```