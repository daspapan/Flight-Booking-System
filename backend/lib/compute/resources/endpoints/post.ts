import { APIGatewayProxyEvent } from "aws-lambda";
import { deletePost } from "../handlers/posts/delete";
import { getOne } from "../handlers/posts/get-one";


export const handler = async (event: APIGatewayProxyEvent) => {
    const id = event.pathParameters?.id;

    if(!id){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing path parameter: id"
            })
        }
    }

    try {

        switch(event.httpMethod){
            case "GET":
                return await getOne({id});
            case "DELETE":
                return await deletePost({id})
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