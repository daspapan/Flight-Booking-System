
import { DynamoDB, ScanCommand } from "@aws-sdk/client-dynamodb";

const dynamoDb = new DynamoDB({
    region: process.env.AWS_REGION
})

export async function getAll(){

    console.log("Get all posts")

    const command = new ScanCommand({
        TableName: process.env.POSTS_TABLE_NAME,
    })
    
    try {

        const results = await dynamoDb.send(command)
        console.log("results", results)
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
                message: "Posts loaded successfully",
                results: results.Items
            })
        }
        
    } catch (error) {
        console.log(error)
        throw error 
    }
}