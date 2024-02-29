import { handler } from "../src/services/spaces/handler";

process.env.AWS_REGION="ap-south-1"
process.env.TABLE_NAME="SpacesStack-0ab0c3f48fe6"


handler({
    httpMethod:'POST',
    
    body:JSON.stringify({
        location:'USA'
    })
} as any, {} as any).then(res => {
    console.log(res)
});