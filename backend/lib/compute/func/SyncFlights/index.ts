import {
    DynamoDBClient,
    ScanCommand,
    UpdateItemCommand,
  } from "@aws-sdk/client-dynamodb";
  
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
});
  
export const handler = async () => {
    try {
        const scanResult = await client.send(
            new ScanCommand({
                TableName: process.env.SEATS_TABLE_NAME,
            })
        );
    
        for (const item of scanResult.Items || []) {
            await client.send(
                new UpdateItemCommand({
                    TableName: process.env.SEATS_TABLE_NAME,
                    Key: {
                        FlightID: item.FlightID,
                        SeatID: item.SeatID,
                    },
                    UpdateExpression: "set IsBooked = :val",
                    ExpressionAttributeValues: {
                        ":val": { S: "false" },
                    },
                })
            );
        }
        return "Updated!";
    } catch (error) {
        throw error;
    }
};