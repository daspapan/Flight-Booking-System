import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const main = async () => {
    const command = new ListTablesCommand({});

    const response: any = await client.send(command);
    // console.log(response.TableNames.join("\n"));
    console.log( response.TableNames[0] );
};

main()

