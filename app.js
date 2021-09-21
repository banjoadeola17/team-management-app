const { ApolloServer, ApolloError } = require("apollo-server");
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
      return new ApolloError("Internal server error.", "INTERNAL_SERVER_ERROR");
    }
    return err;
  },
});

const port = process.env.PORT || 4000;

(async () => {
  try {
    await mongoConnection();
    server.listen(port, async () => {
      logger.info(`Server running on port: ${port}`)
      logger.info(`GraphQl server ready at localhost:${port}/graphql`)
    });

  } catch (error) {
    logger.error('Mongo connection error', error)
  }
})()
