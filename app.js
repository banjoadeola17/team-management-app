const { ApolloServer, ApolloError } = require("apollo-server");
const mongoose = require("mongoose");
const logger = require("./src/logger/logger");
const dotenv = require("dotenv");
const typeDefs = require("./src/schema");
const resolvers = require("./src/resolvers");
const { mongoConnection } = require("./src/config/db")

dotenv.config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  debug: false,
  formatError: (err) => {
    if (err.extensions.code === "INTERNAL_SERVER_ERROR") {
      return new ApolloError("Internal server error.", "ERROR");
    }
    return err;
  },
});

const port = process.env.PORT || 4000;

(async () => {
  try {
    await mongoConnection();
    server.listen(port, async () => {
      console.log(`Server started on port: ${port}`)
      console.log(`GraphQl server ready at localhost:${port}/graphql`)
    });

  } catch (error) {
    console.log('Mongo connection error', error)
  }
})()
