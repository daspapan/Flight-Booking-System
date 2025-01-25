import { APIGatewayProxyEvent } from "aws-lambda";
import { create } from "../handlers/posts/create";
import { getAll } from "../handlers/posts/get-all";


export const handler = async (event: APIGatewayProxyEvent) => {

    try {

        switch(event.httpMethod){
            case "GET":
                return await getAll();
            case "POST":
                return await create(event.body);
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({
                        message: `Method ${event.httpMethod} not allowed`
                    })
                }
        }
        
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Something went wrong. ${error}`
            })
        }
        
    }
}