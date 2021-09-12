import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const DynamoClient = new DynamoDBClient({
    region: 'ap-northeast-1',
})

export default DynamoClient
