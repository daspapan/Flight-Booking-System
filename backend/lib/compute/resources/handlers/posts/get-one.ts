
import { DynamoDB, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDB({
    region: process.env.AWS_REGION
})

export async function getOne({id}:{id:string}){

    const command = new GetItemCommand({
        TableName: process.env.POSTS_TABLE_NAME,
        Key: marshall({
            pk: `POST#${id}`,
        })
    })
    

    try {

        const result = await dynamoDb.send(command)

        if(!result.Item){
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: "Post not found"
                })
            }
        }

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
                message: "Post loaded successfully",
                results: result.Item
            })
        }
        
    } catch (error) {
        console.log(error)
        throw error 
    }
}