const graphql = require("graphql");
const Book = require("../models/book");
const Author = require("../models/author");
const Comment = require("../models/comment")
const apolloServer= require('apollo-server');
const bcrypt = require('bcryptjs')
const bodyParser = require('body-parser')


const gql = require('graphql-tag');

const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const LoginType = new GraphQLObjectType({
  name: "Login",
  fields: () => ({
    email: { type: GraphQLID },
    name: { type: GraphQLString },
    role: { type: GraphQLString },
    id: { type: GraphQLID },
  })
});



const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    cover: { type: GraphQLString },
    format: { type: GraphQLString },
    title: { type: GraphQLString },
    subtitle: { type: GraphQLString },
    lang: { type: GraphQLString },
    genre: { type: GraphQLString },
    stock: { type: GraphQLInt },
    ISBN: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return Author.findById(parent.authorId);
      }
    },
    comment: {
      type: CommenType,
      resolve(parent, args){
        return Comment.findById(parent.commentId)
      }
    }
  })
});

const CommenType = new GraphQLObjectType({
  name: "comment",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    review: { type: GraphQLString },
    score: { type: GraphQLInt },
    books: { 
      type: new GraphQLList(BookType),
      resolve(parent,arg){
        return book.find()
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({ authorId: parent.id });
      }
    }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    comment: {
      type: CommenType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return Book.findById(args.id);
      }
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return Book.find({});
      }
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return Author.find({});
      }
    },
    Comments: {
      type: new GraphQLList(CommenType),
      resolve(parent, args) {
        return Comment.find({});
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age
        });
        return author.save();
      }
    },
    addBook: {
      type: BookType,
      args: {
        genre: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull (GraphQLString) },
        subtitle: { type:  new GraphQLNonNull(GraphQLString) },
        cover: { type: new GraphQLNonNull( GraphQLString) },
        lang: { type: new GraphQLNonNull (GraphQLString) },
        format: { type: new GraphQLNonNull (GraphQLString) },
        genre: { type: new GraphQLNonNull (GraphQLString) },
        stock: { type:new GraphQLNonNull( GraphQLInt) },
        ISBN: { type: new GraphQLNonNull (GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
        commentId: {type: new GraphQLNonNull(GraphQLID)}
      },
      resolve(parent, args) {
        let book = new Book({
          format: args.format,
          stock: args.stock,
          genre: args.genre,
          ISBN: args.ISBN,
          lang: args.lang,
          genre: args.genre,
          genre: args.genre,
          authorId: args.authorId,
          commentId: args.commentId
        });
        return book.save();
      }
    },
    addComment: {
      type: CommenType,
      args: {
        title: { type: GraphQLString },
        review: { type: new GraphQLNonNull(GraphQLString) },
        score: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve(parent, args) {
        let comment = new Comment({
          title: args.title,
          review: args.review,
          score: args.score
        });
        return comment.save();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
