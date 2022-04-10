import { APIGatewayProxyEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';
const s3 = new AWS.S3({ region: 'eu-west-1' });
const { nanoid } = require('nanoid');

const bucketName = process.env.BUCKET || 'cymotive-report-bucket';

exports.handler = async (event: APIGatewayProxyEvent) => {
  const params = {
    ContentType: 'application/json',
    Bucket: bucketName as string,
    Body: '',
    Key: '',
  };

  if (!event.body) {
    throw new Error('Please Add Body');
  }
  const vehicles = JSON.parse(event.body);

  for (let vehicle of vehicles) {
    params.Body = JSON.stringify(vehicle);
    params.Key = `report-${nanoid()}.json`;

    try {
      await s3.putObject(params).promise();
    } catch (error) {
      console.log(error);
      return error;
    }
  }
  return 'succeeded';
};
