import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const eventBridgeClient = new EventBridgeClient({});

export const createBooking = async (
    event: APIGatewayProxyEvent, 
    dynamoDbClient: DynamoDBClient
):Promise<APIGatewayProxyResult> => {

    console.log("EventBusName...", process.env.EVENT_BUS_NAME)

    if(!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "No data provided."
            })
        }
    }
    
    console.log("Event...", JSON.stringify(event, null, 2));

    try {
        const body = JSON.parse(event.body)
        const {flightId, seats, username} = body;
        if(!flightId || !seats || !Array.isArray(seats)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Invalid request body"
                })
            }
        }

        const bookings = await Promise.all(
            seats.map(async(seatId: string) => {
                const bookingId = await getBooking(flightId, seatId, dynamoDbClient);
                if(bookingId) {
                    return {
                        flightId,
                        seatId,
                        bookingId,
                        username
                    }
                }
            })
        )

        if(bookings.some((booking) => booking === "True")){
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "One or more seats are already booked."
                })
            }
        }

        await eventBridgeClient.send(
            new PutEventsCommand({
                Entries: [
                    {
                        Source: "bookFlight",
                        DetailType: "flightBooked",
                        EventBusName: process.env.EVENT_BUS_NAME,
                        Detail: JSON.stringify({
                            flightId,
                            seats,
                            username
                        })
                    }
                ]
            })
        )

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Booking created successfully."
            }),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            }
        }

    } catch (error) {
        console.error("Error...", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error."
            })
        }
    }

}


const getBooking = async(FlightID:string, SeatID:string, dbdClient:DynamoDBClient): Promise<string> => {
    try {

        console.log(`Get booking details ${FlightID}, ${SeatID} from ${process.env.SEATS_TABLE_NAME}`)

        const params = {
            TableName: process.env.SEATS_TABLE_NAME,
            Key: {
                FlightID: { S: FlightID },
                SeatID: { S: SeatID }
            }
        }

        const response = await dbdClient.send(new GetItemCommand(params));
        return response.Item?.IsBooked?.S || "";
        
    } catch (error) {
        throw error
    }
}