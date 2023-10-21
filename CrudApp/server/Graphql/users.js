import { GraphQLScalarType, Kind} from 'graphql';
 
const resolverDate = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return value; // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return ast.value // ast value is always in string format
      }
      return null;
    },
    extensions: {
      codegenScalarType: 'Date | string',
      jsonSchema: {
        type: 'string',
        format: 'date',
      },
    },
  }),
};
  
 export const typeDefs = `
    scalar Date
    type Query {
        users: [User]
        user(id: Int): User
    }
    type User {
        id: Int
        email: String
        name: String
        job_title:String
        joining_date:Date
        content:String
        mime:String
    }
    type Mutation {
      updateUser(id: Int, name: String, email: String, job_title: String, 
        joining_date: Date, content: String, mime: String): User,
      createUser(name: String, email: String, job_title: String, joining_date: Date, 
        content: String, mime: String): User,
      deleteUser(id: Int): Int
    }
`;

export const resolvers = {
  Query: {
    users: async (obj, args, context) => context.DB.users.findAll(),
    user: async (obj, args, context) => context.DB.users.findByPk(args.id)
  },  

  Mutation: {
    createUser : async (obj, args, context) => {
      try {
        return await context.DB.users.create({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date, 
          content:args.content,
          mime:args.mime,
        });
      } catch (err) {alert(err);}
    },  

    deleteUser : async(obj, args, context) => {
      try {
        return await context.DB.users.destroy({
          where: { id:args.id }
        });
      } catch (err) {alert(err)}
    },  

    updateUser : async(obj, args, context) => {
      try {
        return await context.DB.users.update({
          name:args.name, 
          email:args.email, 
          job_title:args.job_title, 
          joining_date:args.joining_date,
          content:args.content,
          mime:args.mime},
          {where: { id:args.id }
        });
      } catch (err) {alert(err);}
    }
  }
};
