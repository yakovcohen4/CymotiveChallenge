import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Lambda Nodejs
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// Api Gateway
import { RestApi, Cors, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
// Generic Services - DynamoDB-Table / s3-Bucket / Iam-Role
import { GenericTable } from '../services/DynamoDB/GenericTable';
import { GenericBucket } from '../services/Bucket/GenericBucket';
import { GenericRole } from '../services/Role/GenericRole';
import * as path from 'path';

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
    'cymotive-report-bucket',
    this
  );

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // ***** porter Lambda *****

    // Create Role
    const porterRole = new GenericRole(
      'porterRole',
      ['service-role/AWSLambdaBasicExecutionRole'] as string[],
      this
    );

    // Create Lambda
    const porterLambda = new NodejsFunction(this, 'porter', {
      functionName: 'cymotive-porter',
      entry: path.join(__dirname, './../services/Lambda/porter/porter.ts'),
      handler: 'handler',
      role: porterRole.role,
      environment: {
        BUCKET: this.cymotiveReportsBucket.bucket.bucketName,
      },
    });

    // porter Lambda - Integration / Resources / Method -  API Gateway
    const porterLambdaIntegration = new LambdaIntegration(porterLambda);
    const porterLambdaResourceAddReport = this.api.root.addResource('api');
    porterLambdaResourceAddReport.addMethod('Post', porterLambdaIntegration);

    // ***** porter Lambda *****
  }
}
