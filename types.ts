import { OptionalId  } from "mongodb";

export type restaurantModel = OptionalId <{
    name: string;
    addres: string;
    city: string;
    phone: string;
    currentTemperature: number;
    localTime: string;
}>;

export type restaurant = {
    id: string;
    name:string;
    addres:string;
    city:string;
    phone: string;
    currentTemperature: number;
    localTime: string;
}