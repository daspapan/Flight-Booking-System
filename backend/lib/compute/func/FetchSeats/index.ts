import { DynamoDBClient, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


const ddbClient = new DynamoDBClient({
    region: "ap-south-1",
});

interface SeatDataType {
    SeatID: string;
    IsBooked: string;
    FlightID: string;
}

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
    console.log("Hello Fetch Seats");

    const flightId = event.pathParameters?.flightId;

    if(!flightId){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing path parameter: flightId"
            })
        }
    }

    console.log("flightId", flightId);
    const command = new QueryCommand({
        TableName: process.env.SEATS_TABLE_NAME,
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
        console.log("=> Fetching Seats");
        const response = await ddbClient.send(command);
        const reply = (response.Items || []).map((i) => unmarshall(i)) as SeatDataType[];
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Seats records fetched successfully.",
                data: reply
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            }
        }
        
    } catch (error: any) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }
}

export { handler };