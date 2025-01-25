import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
    Context,
} from "aws-lambda";

import { createBooking } from "./Create";
const ddbClient = new DynamoDBClient({
    region: "ap-south-1",
});

async function handler(
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> {
    // let message: string;

    console.log("CONTEXT");
    console.log({ event });
    console.log(context);
    console.log(context.identity?.cognitoIdentityId);
    try {
        switch (event.httpMethod) {
            case "GET":
                break;
            case "POST":
                const postReponse = createBooking(event, ddbClient);
                return postReponse;
            default:
                break;
        }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify(error.message),
        };
    }

    const response: APIGatewayProxyResult = {
        statusCode: 200,
        body: JSON.stringify("Posted"),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
    };

    return response;
}

export { handler };