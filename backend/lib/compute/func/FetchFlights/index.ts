import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";


const ddbClient = new DynamoDBClient({
    region: "ap-south-1",
});

interface FlightType {
    Origin: string;
    Destination: string;
    FlightID: string;
    DepartureTime: Date;
    ArrivalTime: Date;
}

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult>{
    console.log("Hello Fetch Flights");

    const command = new ScanCommand({
        TableName: process.env.FLIGHTS_TABLE_NAME,
        Limit: 10,
    });

    try {
        console.log("Fetching Flights");
        const response = await ddbClient.send(command);
        const reply = (response.Items || []).map((i) => unmarshall(i)) as FlightType[];
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Flights records fetched successfully.",
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