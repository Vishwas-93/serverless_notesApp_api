import uuid from "uuid";
import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context, callback) {
    const authProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    // Cognito authentication provider looks like:
    // cognito-idp.us-east-1.amazonaws.com/us-east-1_xxxxxxxxx,cognito-idp.us-east-1.amazonaws.com/us-east-1_aaaaaaaaa:CognitoSignIn:qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr
    // Where us-east-1_aaaaaaaaa is the User Pool id
    // And qqqqqqqq-1111-2222-3333-rrrrrrrrrrrr is the User Pool User Id
    const parts = authProvider.split(':');
    const userPoolIdParts = parts[parts.length - 3].split('/');

    const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
    const userPoolUserId = parts[parts.length - 1];
  const data = JSON.parse(event.body);
  const params = {
    TableName: "notes",
    Item: {
      userId: userPoolUserId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  try {
    await dynamoDbLib.call("put", params);
    callback(null, success(params.Item));
  } catch (e) {
    callback(null, failure({ status: false }));
  }
}