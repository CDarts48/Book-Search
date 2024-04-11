const jwt = require('jsonwebtoken');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = process.env.JWT_SECRET;
// const secret = 'mysecretsshhhhh'; Hard coded to run on local host
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),

  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    console.log('Incoming request headers:', req.headers);
    console.log('Incoming request body:', req.body);    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // Log the received token
    console.log('Received token:', token);
  
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
  
    // Log the processed token
    console.log('Processed token:', token);
  
    if (!token) {
      console.log('No token provided');
      return req;
    }
  
    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      console.log('User data from token:', data);
    } catch (err) {
      console.log('Invalid token:', err);
    }
  
    // send to next endpoint
    return req;
  },
  
  signToken: function ({ username, email, _id }) {
    console.log('Signing token for user:', { username, email, _id });
    const payload = { username, email, _id };
  
    const token = jwt.sign({ data: payload }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
    console.log('Generated token:', token);
  
    return token;
  },
};
