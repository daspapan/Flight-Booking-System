"use server"

// Usage: AWS_PROFILE=fbs npx ts-node ./script.ts
// Make sure to have @aws-sdk/util-dynamodb and @aws-sdk/client-dynamodb modules installed!
// You can use following command to do so: npm install @aws-sdk/client-dynamodb @aws-sdk/util-dynamodb --save
import {
    DynamoDBClient,
    ScanCommand,
    QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import cdkOutput from '@/../cdk-outputs.json';
const output = cdkOutput[`FBS-Dev-Stack`]
  
const client = new DynamoDBClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION as string,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
});
  
const TableName = process.env.NEXT_PUBLIC_FLIGHTS_TABLE || output.FlightsTable;
export interface FlightType {
    Origin: string;
    Destination: string;
    FlightID: string;
    DepartureTime: Date;
    ArrivalTime: Date;
}
export const fetchFlights = async (
    limit: number = 10
): Promise<FlightType[]> => {
    const command = new ScanCommand({
        TableName,
        Limit: limit,
    });
    try {
        const response = await client.send(command);
        
        // Unmarshalling DynamoDB items into JS objects and casting to TS types
        return (response.Items || []).map((i) => unmarshall(i)) as FlightType[];
    } catch (error) {
        console.error(
            `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
                error,
                null,
                2
            )}`
        );

        throw error;
    }
};
export interface SeatDataType {
    SeatID: string;
    IsBooked: string;
    FlightID: string;
}
const SeatBookingTableName = process.env.NEXT_PUBLIC_SEATS_TABLE || output.SeatsTable;
  
export const fetchSeats = async (flightId: string, authToken: string | undefined): Promise<SeatDataType[]> => {
    console.log("fetchSeats", flightId);
    console.log("SeatBookingTableName", SeatBookingTableName);

    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}flights/${flightId}`;
        console.log("URL: ", url);
        const seatsData = await fetch(`https://bu8popi78j.execute-api.ap-south-1.amazonaws.com/dev/flights/${flightId}`, {
            method: "GET",
            headers: {
                Authorization: `${authToken}`,
            },
        })
        const response = await seatsData.json();
        console.log("Fetched Seats 3: ", response);
        return response.data as SeatDataType[]

    } catch (error) {
        console.error(
        `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
            error,
            null,
            2
        )}`
        );

        throw error;
    }

    

    /* 
    const command = new QueryCommand({
        TableName: SeatBookingTableName,
        KeyConditionExpression: "#DDB_FlightID = :pkey",
        ExpressionAttributeNames: {
            "#DDB_FlightID": "FlightID",
        },
        ExpressionAttributeValues: {
            ":pkey": { S: flightId },
        },
        Limit: 42,
    });
    try {
        const response = await client.send(command);

        // Unmarshalling DynamoDB items into JS objects and casting to TS types
        return (response.Items || []).map((i) => unmarshall(i)) as SeatDataType[];
    } catch (error) {
        console.error(
        `Failed to fetch data from DynamoDB. Error: ${JSON.stringify(
            error,
            null,
            2
        )}`
        );

        throw error;
    } */
};

import axios from 'axios'
import useSWR from 'swr'

export const fetchSeatsClientSide = async (flightId: string, authToken: string | undefined): Promise<SeatDataType[]> => {

    console.log("fetchSeats", flightId);
    console.log("SeatBookingTableName", SeatBookingTableName);

    try {
        
        const config = {
            method: "GET",
            headers: {
                Authorization: `${authToken}`,
            }
        };
        const url = `${process.env.NEXT_PUBLIC_API_URL}flights/${flightId}` as string
        console.log("URL: ", url);
        const fetcher = (url:string) => axios.get(url, config).then(res => res.data)
        // const fetcher = (...args) => fetch(...args, config).then(res => res.json())
        console.log("fetcher: ", fetcher)
        const { data, error } = await useSWR(url, fetcher)
        console.log("data: ", data)
        console.log("error: ", error)

        if(error){
            console.error(error)
        }
        console.log("Fetched Seats 2: ", data);

        return data as SeatDataType[]

    } catch (error) {
        console.error(`Failed to fetch data from API Endpoint. Error: ${JSON.stringify(error, null, 2)}`);
        throw error;
    }

};
  