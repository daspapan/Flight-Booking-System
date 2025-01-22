import * as dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import cdkOutput from '../../cdk-outputs.json';

const output = cdkOutput[`FBS-Dev-Stack`]

AWS.config.update({region: process.env.AWS_REGION})

console.log("AWS_REGION", process.env.AWS_REGION)
console.log("TABLE_NAME_FLIGHTS", output.FlightsTable)

// Initialize DynamoDB client
const dynamodb = new DynamoDBClient({});

// Sample data
const data = [
    {
        FlightID: "FL123",
        Origin: "Mumbai",
        Destination: "Los Angeles",
        DepartureTime: "2023-07-01T08:00:00",
        ArrivalTime: "2023-07-01T11:00:00",
    },
    {
        FlightID: "FL456",
        Origin: "Bengaluru",
        Destination: "Miami",
        DepartureTime: "2023-07-02T09:30:00",
        ArrivalTime: "2023-07-02T12:30:00",
    },
];

// Insert data into DynamoDB table
const putItems = async () => {
    for (const item of data) {

        try {
            const params = {
                TableName: output.FlightsTable,
                Item: marshall(item),
            };
            
            const putItemCommand = new PutItemCommand(params)
            const putResponse = await dynamodb.send(putItemCommand)
            console.log(`Successfully added item: ${JSON.stringify(putResponse)}`);
            
        } catch (error: any) {
            console.log(error)
            console.error(
                `Error adding item: ${JSON.stringify(item)} - ${error.message}`
            );
        }
    }
};

putItems();