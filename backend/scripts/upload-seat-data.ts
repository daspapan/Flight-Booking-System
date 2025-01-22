import * as dotenv from "dotenv";
dotenv.config();
import AWS from "aws-sdk";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import cdkOutput from '../../cdk-outputs.json';
const output = cdkOutput[`FBS-Dev-Stack`]

AWS.config.update({region: process.env.AWS_REGION})

console.log("AWS_REGION", process.env.AWS_REGION)
console.log("TABLE_NAME_SEATS", output.SeatsTable)

// Initialize DynamoDB client
const dynamodb = new DynamoDBClient({});

// Sample data
const data = [
    { FlightID: "FL123", SeatID: "1A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "1B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "1C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "1D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "1E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "1F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "2F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "3F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "4F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "5F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "6F", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7A", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7B", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7C", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7D", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7E", IsBooked: "false" },
    { FlightID: "FL123", SeatID: "7F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "1F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "2F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "3F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "4F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "5F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "6F", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7A", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7B", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7C", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7D", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7E", IsBooked: "false" },
    { FlightID: "FL456", SeatID: "7F", IsBooked: "false" },
];

// Insert data into DynamoDB table
const putItems = async () => {
    for (const item of data) {
        try {
            

            const params = {
                TableName: output.SeatsTable,
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