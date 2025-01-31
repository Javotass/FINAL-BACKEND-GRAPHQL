export const schema = `#graphql
  type restaurant {
    id: ID!
    name: String!
    addres: String!
    city: String!
    phone: String!
    currentTemperature: Float!
    localTime: String!
  }

  type Query {
    getRestaurant(id: ID!): restaurant
    getRestaurants(city: String!): [restaurant!]!
  }

  type Mutation{
    addRestaurant(name: String!, addres: String!, city: String!, phone: String!): restaurant!
    deleteRestaurant(id: ID!): Boolean!
  }
`;