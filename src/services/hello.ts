import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { v4 } from "uuid";

const s3Client = new S3Client({});

async function handler(event:APIGatewayProxyEvent, context: Context) {

    const command = new ListBucketsCommand({});
    const listBucketResults = (await s3Client.send(command)).Buckets;

    const response: APIGatewayProxyResult={
        statusCode:200,
        body: JSON.stringify('Hello from TS Lambda, this is the id : ' + JSON.stringify(listBucketResults))
    }
    console.log(event)
    return response;
}

export { handler }

/*exports.main = async function(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify(`Hello, I read from ${process.env.TABLE_NAME}`)
    }
}*/