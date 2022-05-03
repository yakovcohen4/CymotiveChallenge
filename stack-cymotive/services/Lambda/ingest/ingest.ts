import * as AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: 'eu-west-1' });
const db = new AWS.DynamoDB.DocumentClient({ region: 'eu-west-1' });
import { S3Event } from 'aws-lambda';

const tableName = (process.env.TABLE as string) || 'cymotiveTable';

exports.handler = async (event: S3Event) => {
  const s3Params = {
    Bucket: event.Records[0].s3.bucket.name,
    Key: '',
  };
  const dynamoParams = {
    TableName: tableName,
    Item: {},
  };

  try {
    // get all files from bucket
    const listKeys = await listOfKeys(s3Params.Bucket);

    // push file to DynamoDB
    for (let key of listKeys) {
      if (key) {
        s3Params.Key = key;
        const { Body } = await s3.getObject(s3Params).promise();
        if (!Body) {
          throw Body;
        }

        const obj = await JSON.parse(Body.toString());
        dynamoParams.Item = obj;
        await db.put(dynamoParams).promise();
      }
    }
    // return all
    return 'succeed';
  } catch (error) {
    console.log(error);
    return 'error';
  }
};

const listOfKeys = async (Bucket: any) => {
  const keyList = [];
  const list = await s3.listObjects({ Bucket }).promise();
  for (let vehicleKey of list.Contents!) {
    keyList.push(vehicleKey.Key);
  }
  return keyList;
};
