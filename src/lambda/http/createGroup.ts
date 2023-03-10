import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

export const handler:APIGatewayProxyHandler = async (event:APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);
  const itemId = uuid.v4();

  let parsedBody;

  try {
    parsedBody = JSON.parse(event.body);
  } catch (error) {
    console.log("Error parsing event body: ", error);
  }

  const newItem = {
    id: itemId,
    ...parsedBody,
  };

  await docClient
    .put({
      TableName: groupsTable,
      Item: newItem,
    })
    .promise();

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
