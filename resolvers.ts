import { Collection, ObjectId } from "mongodb";
import { restaurantModel } from "./types.ts";
import { GraphQLError } from "graphql";



type Context = {
  restuarantCollection: Collection<restaurantModel>;
}

export const resolvers = {
  Query:  {
    getRestaurant: async (
       _: unknown,
       args: {id: string},
       ctx: Context
    ): Promise <restaurantModel | null> => {
      return await ctx.restuarantCollection.findOne({_id: new ObjectId(args.id)});
    },
    getRestaurants: async (
      _: unknown,
       args: {city: string},
       ctx: Context
    ):  Promise <restaurantModel[]> => {
      return await ctx.restuarantCollection.find({city: args.city}).toArray();
    },
  },
  Mutation: {
    addRestaurant: async (
      _: unknown,
      args: {name: string; addres: string; city: string; phone: string},
      ctx: Context
    ): Promise <restaurantModel > => {
      const {name, addres, city, phone } = args;

      const existringRestaurant = await ctx.restuarantCollection.findOne({phone});
      if(existringRestaurant ) {
          throw new GraphQLError(" Ya existe un restaurante con ese número de telefono ");
      }
      const API_KEY = Deno.env.get("API_KEY");
      const weatherResponse = await fetch(
        `https://api.api-ninjas.com/v1/weather?city= ${city}`,
        {headers:{ 'X-Api-Key': API_KEY}}
      );
      if(weatherResponse.status !== 200 ){
        throw new GraphQLError(`Error al obtener el clima: ${weatherResponse.statusText}`);
      }
      const weatherData = await weatherResponse.json();
      const currentTemperature: number = weatherData.temp;


      const timeResponse = await fetch(
        `https://api.api-ninjas.com/v1/worldtime?city={} ${city}`,
        {headers:{ 'X-Api-Key': API_KEY}}
      );
      if(timeResponse.status !== 200){
        throw new GraphQLError(`Error al obtener el clima: ${timeResponse.statusText}`);
      }
      
      const timeData = await timeResponse.json(); 
      const localTime: string = timeData.localTime;


      const { insertedId } = await ctx.restuarantCollection.insertOne({
          name,
          addres,
          city,
          phone,
          currentTemperature,
          localTime
      });
      const newRestaurant = await ctx.restuarantCollection.findOne({_id: insertedId});
      if(!newRestaurant){
        throw new GraphQLError("Error al guardar el restaurante");
      }
      return newRestaurant;
    },
    deleteRestaurant: async (
      _:unknown,
      args: {id: string},
      ctx: Context 
    ): Promise <boolean> => {
      const {deletedCount } = await ctx.restuarantCollection.deleteOne({
        _id: new ObjectId(args.id),
      });
      return !!deletedCount;
    },
  },
  restaurant: {
    id:(parent: restaurantModel) => parent._id?.toString(),
  },
}