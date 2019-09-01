import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const parts = authProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');

    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
    const userPoolUserId = parts[parts.length - 1];
    const params = {
    TableName: "notes",
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userPoolUserId
    }
  };

  try {
    const result = await dynamoDbLib.call("query", params);
    // Return the matching list of items in response body
    callback(null, success(result.Items));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}