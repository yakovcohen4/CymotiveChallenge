import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// Api Gateway
import { RestApi, Cors, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
// Generic Table
import { GenericTable } from '../services/DynamoDB/GenericTable';

export class StackCymotiveStack extends Stack {
  // api: RestApi;
  private api = new RestApi(this, 'cymotiveApi', {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_ORIGINS,
    },
  });

  // Create Table : cymotiveTable
  private cymotiveTable = new GenericTable('cymotiveTable', 'vehicleId', this);

  // create Bucket
  private cymotiveReportsBucket = new GenericBucket(
    'cymotive-reports-bucket',
    this
  );

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
