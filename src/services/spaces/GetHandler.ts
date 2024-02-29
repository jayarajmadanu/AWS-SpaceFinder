import { DynamoDBClient, ScanCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";


export async function getHandler(event: APIGatewayProxyEvent, dynamoDbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {

    if(event.queryStringParameters){
        if('id' in event.queryStringParameters){
            const spaceId = event.queryStringParameters['id'];
            const getItemResponse = await dynamoDbClient.send(new GetItemCommand({
                TableName: process.env.TABLE_NAME,
                Key:{
                    'id': {S: spaceId}
                }
            }));

            if(getItemResponse.Item){
                const unmashlledItem = unmarshall(getItemResponse.Item)
                console.log(JSON.stringify(unmashlledItem))
                return {
                    statusCode: 200,
                    body: JSON.stringify(getItemResponse.Item)
                }
            } else {
                return {
                    statusCode: 400,
                    body: JSON.stringify(`Space with id : ${spaceId} not found`)
                }
            }
        }
    }

    const result = await dynamoDbClient.send(new ScanCommand({
        TableName: process.env.TABLE_NAME
    }));
    const unmashlledItems = result.Items?.map(item => unmarshall(item));
    console.log(JSON.stringify(unmashlledItems))
    return {
        statusCode: 201,
        body: JSON.stringify(unmashlledItems)
    }
}