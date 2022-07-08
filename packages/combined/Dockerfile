FROM node:16

# Working directory
WORKDIR /app

# Install all the yarn stuff
COPY package.json yarn.lock lerna.json ./
COPY packages/authenticationContracts/package.json ./packages/authenticationContracts/
COPY packages/authenticationService/package.json ./packages/authenticationService/
COPY packages/authorizationContracts/package.json ./packages/authorizationContracts/
COPY packages/authorizationService/package.json ./packages/authorizationService/
COPY packages/avalancheService/package.json ./packages/avalancheService/
COPY packages/chainContracts/package.json ./packages/chainContracts/
COPY packages/combined/package.json ./packages/combined/
COPY packages/ethereumChainBase/package.json ./packages/ethereumChainBase/
COPY packages/events/package.json ./packages/events/
COPY packages/fujiService/package.json ./packages/fujiService/
COPY packages/ipfsContracts/package.json ./packages/ipfsContracts/
COPY packages/ipfsService/package.json ./packages/ipfsService/
COPY packages/mumbaiService/package.json ./packages/mumbaiService/
COPY packages/objects/package.json ./packages/objects/
COPY packages/polygonService/package.json ./packages/polygonService/
COPY packages/queues/package.json ./packages/queues/
COPY packages/rinkebyService/package.json ./packages/rinkebyService/
COPY packages/security/package.json ./packages/security/
COPY packages/sharedComponents/package.json ./packages/sharedComponents/
COPY packages/utils/package.json ./packages/utils/
RUN yarn install --network-timeout 60000

# Copy source
COPY . .

# Build and cleanup
ENV NODE_ENV=production
#RUN apt-get -qy update && apt-get -qy install openssl
RUN yarn prisma-generate

RUN yarn compile

# Start server
WORKDIR /app/packages/combined
EXPOSE 3000
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
EXPOSE 3004
EXPOSE 3005
CMD ["yarn", "start"]
