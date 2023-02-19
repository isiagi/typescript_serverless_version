import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE

export const handler:APIGatewayProxyHandler = async (event:APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event)

  const result = await docClient.scan({
    TableName: groupsTable
  }).promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}

// POST - https://g2d32rktxk.execute-api.us-east-1.amazonaws.com/dev/groups
// GET - https://g2d32rktxk.execute-api.us-east-1.amazonaws.com/dev/groups/{groupId}/images
// GET - https://g2d32rktxk.execute-api.us-east-1.amazonaws.com/dev/images/{imageId}
// GET - https://jam3u45gk2.execute-api.us-east-1.amazonaws.com/groups
