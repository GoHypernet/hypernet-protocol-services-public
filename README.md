[![Moleculer](https://badgen.net/badge/Powered%20by/Moleculer/0e83cd)](https://moleculer.services)

# Hypernet.ID
This is a [Moleculer](https://moleculer.services/)-based microservices project.

## Usage
This project makes heavy use of Docker, and for dev purposes runs using Docker Compose. The `yarn start` command at the root will start all the required docker components (which must be dockerized first). Although the backend used a microservice architecture, for ease of development all the services are combined into a single docker image. The front end portals (onboarding, userPortal, customerPortal, and internalPortal) must each be dockerized individually. You may use the `yarn dockerize` command at the root to do this but be ready for it to take a long time.

After the first start, you must run `yarn bootstrap` which will create and configure all the databases. This project uses a database-per-service pattern, and the bootstrap command will deploy all the data schemas and seed the databases for the services. To conserve resources in development, all services will use a single shared-db container, but each service has it's own schema(s) in the database.

Start the project with `yarn start` command. 
After starting, open the http://localhost:9005/ URL in your browser to open the Onboarding Portal.

In the terminal, try the following commands:
- `nodes` - List all connected nodes.
- `actions` - List all registered service actions.
- `call greeter.hello` - Call the `greeter.hello` action.
- `call greeter.welcome --name John` - Call the `greeter.welcome` action with the `name` parameter.
- `call products.list` - List the products (call the `products.list` action).

## Getting Started
There are two major tasks to bootstrap the project for running on your local: creating the docker containers and getting the databases up and running. For the docker containers, the primary issue is the fact that it is resource intensive. We have a single command that will dockerize everything (`yarn dockerize` at the root), but it runs in parallel and will bring most machines to their knees. For the database, the issue is in keeping your DB up to date. In all cases, a basic understanding of docker is necessary.

When you run the project on your local, we use a tool called Docker Compose to run it. Compose is an easy way to run multiple, interlinking containers. You can view the various containers that will run in the `docker-compose.yaml` file at the root. Once the project is started, you can easily view all the running containers via the Docker Desktop app; all the containers for ID will be in a group. The containers include:

- The combined backend server "combined"
- A local blockchain image, "blockchain"

You should get familiar with either Docker Desktop or the docker command line, so that you know how to individually start, stop, restart, and kill these containers. This will greatly expedite your speed in development and debugging. Docker Compose has two major operations, `docker-compose up` and `docker-compose down`; the first will setup and run all the defined containers, and the latter will kill and dispose of the containers. The `down` command is quite destructive, as all your containers will need to be rebuilt from scratch. This is particularly problematic for the SQL server, as it maintains state; `docker-compose down` will wipe out that state. It is usually better to just stop things individually if you need to.

You should understand the difference between a Docker Image and Container. An Image is the source data, the starting point. A container is a single running copy of an Image. A container maintains its disk state after it is stopped, but a discarded container's state is lost. A container that is stopped will maintain its disk state, but must start again for dynamic (RAM) state. A good example is the difference between the shared-sql and blockchain containers. The SQL container maintains the DB state on disk, so when you stop the container and restart it, the MySQL server will reboot, but the data is preserved. The blockchain container does not store it's state on disk, so when you stop it and restart it, it starts completely fresh- your blockchain is completely reset to the starting state.

This mismatch can be problematic! Because there is stuff in the Database that corresponds to other things on the chain. If the chain is reset, the database will be out of sync and lots of stuff will be broken. In this case, you can either kill the database and re-bootstrap it, or you can run some SQL commands to truncate the databases to clear out potentially mismatching data. This is still a valuable step but you must understand what you are doing.

### First Steps
You will need to have Docker on your system, and Yarn installed. From the root of the project, the first command to run is:
`yarn install`
This will install all the necessary dev tooling.

### Docker Container Creation
You will want to update your docker containers whenever you start working on a new feature. For Dev purposes, there is a single backend container to keep it easy; however, each frontend portal must be dockerized individually. The best way to do this is open up your terminal, starting at the root of the project:
- `cd packages/combined`
- `yarn dockerize` This will take a while
- `cd ../onboarding`
- `yarn dockerize` This will build the Onboarding Portal
- `cd ../userPortal`
- `yarn dockerize` This will build the User Portal
- `cd ../..`

### Database Initialization
There are many backend microservices and each has its very own database (or set of DBs). For ease of resources, all of their DBs run on a single host container, shared-sql. When you start that container from scratch, you will need to deploy the schemas and do the seeding. Fortunately, this should be a one-step command from the project root,

`yarn bootstrap`

This command will start the database container, connect to it, create the schemas, setup the users and credentials necessary for the services, and seed the database with any initial data. This seeding process can be expanded greatly for use by QA.

### Create Credentials
You need to go to Dashlane and obtain several Google credential files. Create a file ipfs-service-credential.json in the `credentials` folder. Check the readme in that folder for more details.

### Final Test
Run `yarn start` at the root of the project, and you will see a lot of things happen. You are looking at the logs for the backend server. You will know it's ready to go when you see a message like: "INFO  304e9dbee1d3-76/BROKER: ✔ ServiceBroker with 16 service(s) started successfully in 701ms." You can then open the Onboarding portal by pointing your browser to http://localhost:9005 and proceed to test.

## Testing
After the database is seeded, it creates an admin identity for local use. The private key for this identity is "c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3" and the account address is "0x627306090abaB3A6e1400e9345bC60c78a8BEf57", which is the first account from the well-known "candy maple..." mnemonic.

## Services
- **api**: API Gateway services
- **greeter**: Sample service with `hello` and `welcome` actions.
- **products**: Sample DB service. To use with MongoDB, set `MONGO_URI` environment variables and install MongoDB adapter with `npm i moleculer-db-adapter-mongo`.

## Useful links

* Moleculer website: https://moleculer.services/
* Moleculer Documentation: https://moleculer.services/docs/0.14/

## Yarn scripts

- `yarn start`: Start development mode (load all services locally with hot-reload & REPL)
- `yarn bootstrap`: deploys all schemas to the shared-db and seeds the databases. shared-db must be running first (probably via `yarn start`)

## SQL Tunnels
This project allows you to connect to the dev and prod environment SQL environments using the Google Cloud SQL Proxy. The yarn commands `yarn dev-tunnel` and `yarn prod-tunnel` will create tunnels into the proper environments. Eventually, there will be multiple commands depending on which database you want to connect to. You will need to create a file named `hypernet-id-development.json` or `hypernet-id-production.json` at the root of the project in order for the tunnel commands to succeed. The contents of these files should be a Google JSON format key. You can access these in Dashlane; look for a note named "Hypernet.ID Production SQL Key" or "Hypernet.ID Development SQL Key". Once the tunnel is established, you can connect to the database using the standard MySQL login process. The credentials you will need for this are stored in the Google Secret Manager in the Cloud Console. 

Make sure you do not inadvertently commit the credential files. They are in the gitignore already, but if you misname them and commit them you will pollute our repository and we will have to regenerate the keys.

## Creating a new Package
When you want to create a new package in the repository, you need to follow these steps:

1. Copy and paste an existing package to use as the base. This is just so much easier.
2. Open the new package.json and rename it. The nameing scheme is @hypernetlabs/hypernet.id-your-new-package
3. Alter the rest of the package.json, including the author and readme links. Make sure the version is 0.0.1
4. In the project root, open tsconfig.json, and add a new entry under "references". Make sure to keep the list in alphabetical order.
5. In the project root, open tsconfig.build.json, and add a new entry under "paths".
6. Update all the Dockerfiles. As of this writing, there are 3 of these, in the "combined", "onboarding" and "userGateway" packages. You need to copy the package's package.json over before the `yarn install` step. Make sure all the dockerfiles do this in the same order and the same way to ensure local caching works.

You're done adding the package! To consume it from another package, do this:
1. Add it as a dependency to the package.json. Use ">=0.0.1" as the version, which basically says, use the latest version, whatever it is.
2. In the tsconfig.json of the consuming package, add the new package under "references". This assures that the dependency will be compiled first, and prevents errors during compilation. Without this, TypeScript will compile the packages in parallel, and complain that the dependency does not exist (because it is not yet compiled), which just sucks to track down.
3. Finish up with a `yarn install` to make sure everything is linked.

## Creating a new Service
When you want to create a new service in the repository, follow all the steps for creating a new package (above) first. After that, you need to do these additional steps:

1. Add an entry into EService enum in the `objects` package
2. In the `combined` package, under "services" create a myNewService.service.ts file. Follow the pattern.
3. Make sure you add a dependency to your service package to combined, and a reference to the tsconfig.json.
4. Make sure to define a new Service Key for your service (see below), and add it, AND the corresponding account address, to the docker-compose.env at the root. 
5. Be sure to coordinate with the Devops team to make sure these new configs and secrets are deployed and generated in Sandboxes, Dev and Production environments.
6. Be sure to create a myNewServiceContracts package.

## Service Keys

Each service is issued an ethereum private key, which they can use to obtain Service Tokens, which are JWTs issued by the Authorization Service to all the other (relying) services. The relying service can present its Service Token to another service as proof of origin. Services will also sign their responses and emitted events with the key so that the recievers can verify their origin. 

For local development, Generate all the the private keys from a same mnemonic: 

tusht river soft copy panther two solid song dance feel fox rifle

