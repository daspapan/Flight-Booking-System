
import { DeleteItemCommand, DynamoDB } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDB({
    region: process.env.AWS_REGION
})

export async function deletePost({id}:{id:string}){

    const command = new DeleteItemCommand({
        TableName: process.env.POSTS_TABLE_NAME,
        Key: marshall({
            pk: `POST#${id}`,
        })
    })
    

    try {

        await dynamoDb.send(command)
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Post deleted successfully"
            })
        }
        
    } catch (error) {
        console.log(error)
        throw error 
    }
}