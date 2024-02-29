import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { validateAsSpaceEntry } from "../shared/Validator";
import { createRandomId, parseJSON } from "../shared/Utils";


export async function postHandler(event: APIGatewayProxyEvent, dynamoDbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
    const generatedId = createRandomId();
    const item = parseJSON(event.body);
    item.id = generatedId
    validateAsSpaceEntry(item)

    const result = await dynamoDbClient.send(new PutItemCommand({
        TableName: process.env.TABLE_NAME,
        Item: marshall(item)
    }));

    return {
        statusCode: 201,
        body: JSON.stringify({id: generatedId})
    }
}