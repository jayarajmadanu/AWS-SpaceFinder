import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { postHandler } from "./PostHandler";
import { getHandler } from "./GetHandler";
import { updateSpace } from "./UpdateHandler";
import { deleteSpace } from "./DeleteHandler";
import { JsonError, MissingFieldError } from "../shared/Validator";
import { addCorsHeader } from "../shared/Utils";

const dynamoDbClient = new DynamoDBClient({});
async function handler(event: APIGatewayProxyEvent, context: Context) {

    let response: APIGatewayProxyResult;

    try {
        switch (event.httpMethod) {
            case 'GET':
                const getResponse = await getHandler(event, dynamoDbClient);
                response = getResponse;
                break;
            case 'POST':
                const postResponse = await postHandler(event, dynamoDbClient);
                response = postResponse;
                break;
            case 'PUT':
                const putResponse = await updateSpace(event, dynamoDbClient);
                console.log(putResponse)
                response = putResponse;
                break;
            case 'DELETE':
                const deleteResponse = await deleteSpace(event, dynamoDbClient);
                console.log(deleteResponse)
                response = deleteResponse;
                break;
            default:
                break;
        }
    } catch (error) {
        console.error(error.message);
        if (error instanceof MissingFieldError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        if (error instanceof JsonError) {
            return {
                statusCode: 400,
                body: error.message
            }
        }
        return {
            statusCode:500,
            body: JSON.stringify(error.message)
        }
    }
    
    addCorsHeader(response);
    return response;
}

export { handler }

/*exports.main = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify(`Hello, I read from ${process.env.TABLE_NAME}`)
    }
}*/