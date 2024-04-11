const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const resolvers = {
  Query:{
    me: async (parent, args, context) => {
      if (context.user) {
        return User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      console.log('User:', user);
      const token = signToken(user);
      console.log('Token:', token);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
    
      if (!user) {
        throw AuthenticationError;
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw AuthenticationError;
      }
    
      console.log('User:', user); // Log the user
      const token = signToken(user);
      console.log('Token:', token); // Log the token
      return { token, user };
    },
    saveBook: async(parent, {book}, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: book } },
          { new: true, runValidators: true }
        );
        return user;
      }
      throw AuthenticationError;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        if (!user) {
          throw new Error('No user found with this id!');
        }
        return user;
      }
      throw AuthenticationError;
    }
  }
}

module.exports=resolvers;