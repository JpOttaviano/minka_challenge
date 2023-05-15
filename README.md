# Minka ZEF application

This repository is the solution backend and db service to this task:
https://gist.github.com/zrumenjak/dfbd960482918a5ac0edf65c7453a14a

## Summary

This project is a Node.Js express application with a sequelize generated model db. The needs to start both the database with both the migrations and seed data as well as the express server to listen to requests.

The application can be started in the current envrionment or in a dockerized container, whichever you preffer.

Before anything run
```
npm install
```
To install all necesary dependencies.


## Docker install and run

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
npm run test
```
to run all the tests on the recently started application.

## Non-docker install and run

Basically the same, but without starting a docker container
```
npm run db:create:all
npm run start:dev
```
or
```
npm run tests
```

### Caveats

In case the database create all commands fails, there is the possibility to run the creation, migration and seed in separate singular commands like
```
npm run db:create
npm run db:migrate
npm run db:seed
```