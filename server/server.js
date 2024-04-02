const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3002;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // Call our authMiddleware function with the incoming request
    const authUser = authMiddleware(req);

    // Add the user to the context
    return { user: authUser };
  },
});

app.use(cors());

const startApolloServer = async () => {
  await server.start();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  server.applyMiddleware({ app, path: '/graphql' });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// Call the async function to start the server
startApolloServer();