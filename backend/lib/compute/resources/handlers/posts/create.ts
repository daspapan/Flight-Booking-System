import { randomUUID } from "crypto";
import { IPost } from "../../../../../types";
import { DynamoDB, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const dynamoDb = new DynamoDB({
    region: process.env.AWS_REGION
})

export async function create(body: string | null){
    const uuid = randomUUID()

    if(!body){
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing body"
            })
        }
    }

    const bodyParser = JSON.parse(body) as IPost;
    console.log("bodyParser", bodyParser)
    
    const command = new PutItemCommand({
        TableName: process.env.POSTS_TABLE_NAME,
        Item: marshall({
            pk: `POST#${uuid}`,
            title: bodyParser.title,
            author: bodyParser.author,
            description: bodyParser.description,
            publicationDate: bodyParser.publicationDate
        })
    })
    

    try {

        await dynamoDb.send(command)
        return {
            statusCode: 201,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Credentials": true,
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET,DELETE",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                message: "Post created successfully"
            })
        }
        
    } catch (error) {
        console.log(error)
        throw error 
    }
}