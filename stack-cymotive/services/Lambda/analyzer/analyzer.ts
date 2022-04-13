import * as AWS from 'aws-sdk';
import { APIGatewayProxyEvent } from 'aws-lambda'; //Typescript
const db = new AWS.DynamoDB.DocumentClient();
const tableName = (process.env.TABLE as string) || 'cymotiveTable';

exports.handler = async (event: APIGatewayProxyEvent) => {
  // get the path parameter from the event
  const path = event.path.split('/')[1];
  const scanParams = {
    TableName: tableName,
  };
  let counter = 0;

  // number Of Vehicles / Reports
  const response = await db.scan(scanParams).promise();
  const { Items } = response;

  if (!Items) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'No data found',
      }),
    };
  }

  for (let Item of Items) {
    const allSignalsPerMinute = Item.signalsPerMinute;

    for (let key of Object.keys(allSignalsPerMinute)) {
      const sum = allSignalsPerMinute[key].sum;
      const min = allSignalsPerMinute[key].acceptableMinValue;
      const max = allSignalsPerMinute[key].acceptableMaxValue;

      if (min > sum || sum > max) {
        counter++;
      }
    }
  }

  const ans: any = {
    numberofreports: Items.length,
    numberofvehicles: Items.length,
    numberofanomalies: counter,
  };
  return {
    statusCode: 200,
    body: JSON.stringify(ans[path]),
  };
};
