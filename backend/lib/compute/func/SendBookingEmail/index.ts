import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { unmarshall } from "@aws-sdk/util-dynamodb";
const sesClient = new SESv2Client({
    region: process.env.AWS_REGION,
});

export const handler = async (event: {
    detail: {
        flightId: string;
        seats: string[];
        username: string;
    };
}): Promise<void> => {
    
    const { flightId, seats } = event.detail;
    console.log("FLIGHT ID IS", flightId);
    console.log("SEATS ARE", seats);
    console.log("USERNAME", event.detail.username);

    const senderEmail = "hum.tum.8765@gmail.com";
    const templateName = "BookingReceiptTemplate";

    const userData = await getUser(event.detail.username);
    const useremail = userData[0].email;
    console.log(useremail);

    try {
        const response = await sesClient.send(
            new SendEmailCommand({
                FromEmailAddress: senderEmail,
                Content: {
                    Template: {
                        TemplateName: templateName,
                        TemplateData: JSON.stringify({
                            flightId,
                            seats,
                        }),
                    },
                },
                Destination: {
                    ToAddresses: [useremail],
                },
            })
        );
        console.log({ response });
    } catch (error) {
        throw error;
    } 
};

const getUser = async (username: string) => {
    const ddbClient = new DynamoDBClient({
        region: process.env.AWS_REGION,
    });

    const command = new QueryCommand({
        TableName: process.env.USERS_TABLE_NAME,
        IndexName: "usernameIndex",
        KeyConditionExpression: "#DDB_username = :pkey",
        ExpressionAttributeNames: {
            "#DDB_username": "Username",
        },
        ExpressionAttributeValues: {
            ":pkey": { S: username },
        },
    });

    try {
        const response = await ddbClient.send(command);
        return (response.Items || []).map((i) => unmarshall(i)) as any;
    } catch (error) {
        throw error;
    }
};