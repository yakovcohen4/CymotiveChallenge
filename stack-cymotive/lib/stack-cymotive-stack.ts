import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// Lambda Nodejs
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { S3EventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
// Api Gateway
import {
  RestApi,
  Cors,
  LambdaIntegration,
  AuthorizationType,
} from 'aws-cdk-lib/aws-apigateway';
// iam Role
import {
  Effect,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
// Generic Services - DynamoDB-Table / s3-Bucket
import { GenericTable } from '../services/DynamoDB/GenericTable';
import { GenericBucket } from '../services/Bucket/GenericBucket';
import { EventType } from 'aws-cdk-lib/aws-s3';

import * as path from 'path';

export class StackCymotiveStack extends Stack {
  // api: RestApi
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

    // Create Porter role
    const porterRole = new Role(this, 'porter-role-cdk', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'CymotivePorterRole',
      inlinePolicies: {
        PorterPolicy: new PolicyDocument({
          statements: [
            // Bucket policy - only to put objects
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['s3:PutObject'],
              resources: [this.cymotiveReportsBucket.bucket.bucketArn],
            }),
            // CloudWatch policy
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'logs:CreateLogStream',
                'logs:CreateLogGroup',
                'logs:PutLogEvents',
              ],
              resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/*:*:*`,
              ],
            }),
          ],
        }),
      },
    });

    // add permissions to bucket for the porter role
    this.cymotiveReportsBucket.bucket.grantWrite(porterRole);

    // Create Lambda
    const porterLambda = new NodejsFunction(this, 'porter', {
      functionName: 'cymotive-porter',
      entry: path.join(__dirname, './../services/Lambda/porter/porter.ts'),
      handler: 'handler',
      role: porterRole,
      environment: {
        BUCKET: this.cymotiveReportsBucket.bucket.bucketName,
      },
    });

    // Connection porter Lambda with API Gateway - Integration / Resources / Method
    const porterLambdaIntegration = new LambdaIntegration(porterLambda);
    const porterLambdaResourceAddReport = this.api.root.addResource('api');
    porterLambdaResourceAddReport.addMethod('Post', porterLambdaIntegration, {
      authorizationType: AuthorizationType.NONE,
    });

    // ***** porter Lambda *****

    // ***** ingest Lambda *****

    // Create ingest role
    const ingestRole = new Role(this, 'ingest-role-cdk', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'CymotiveIngestRole',
      inlinePolicies: {
        PorterPolicy: new PolicyDocument({
          statements: [
            // Provides read only access cymotiveReportsBucket
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                's3:Get*',
                's3:List*',
                's3-object-lambda:Get*',
                's3-object-lambda:List*',
              ],
              resources: [this.cymotiveReportsBucket.bucket.bucketArn],
            }),
            // Permission to put objects in DynamoDB-Table
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['dynamodb:PutItem'],
              resources: [this.cymotiveTable.table.tableArn],
            }),
            // Permission to put objects in S3-Bucket
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: ['s3:PutObject'],
              resources: [this.cymotiveReportsBucket.bucket.bucketArn],
            }),
            // CloudWatch policy
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'logs:CreateLogStream',
                'logs:CreateLogGroup',
                'logs:PutLogEvents',
              ],
              resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/*:*:*`,
              ],
            }),
          ],
        }),
      },
    });

    // add permissions to bucket and table for the porter role
    this.cymotiveReportsBucket.bucket.grantRead(ingestRole);
    this.cymotiveTable.table.grantWriteData(ingestRole);

    // Create Lambda
    const ingestLambdaNodejs = new NodejsFunction(this, 'ingest', {
      functionName: 'cymotive-ingest',
      entry: path.join(__dirname, './../services/Lambda/ingest/ingest.ts'),
      handler: 'handler',
      role: ingestRole,
      environment: {
        TABLE: this.cymotiveTable.table.tableName,
      },
    });

    // S3 Bucket event source
    const eventS3 = new S3EventSource(this.cymotiveReportsBucket.bucket, {
      events: [EventType.OBJECT_CREATED_PUT],
      filters: [{ suffix: '.json' }], // optional
    });

    // event source to ingest Lambda - to ingest data from S3
    ingestLambdaNodejs.addEventSource(eventS3);

    // ***** ingest Lambda *****

    // ***** analyzer Lambda *****
    const analyzerRole = new Role(this, 'analyzer-role-cdk', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      roleName: 'CymotiveAnalyzerRole',
      inlinePolicies: {
        PorterPolicy: new PolicyDocument({
          statements: [
            // Permission to Read objects in DynamoDB-Table
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:DescribeTable',
                'dynamodb:BatchGetItem',
                'dynamodb:Scan',
                'dynamodb:Query',
                'dynamodb:ConditionCheckItem',
                'dynamodb:List*',
              ],
              resources: [this.cymotiveTable.table.tableArn],
            }),
            // CloudWatch policy
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'logs:CreateLogStream',
                'logs:CreateLogGroup',
                'logs:PutLogEvents',
              ],
              resources: [
                `arn:aws:logs:${this.region}:${this.account}:log-group:/aws/lambda/*:*:*`,
              ],
            }),
          ],
        }),
      },
    });

    // add permissions to table for the analyzer role
    this.cymotiveTable.table.grantReadData(analyzerRole);

    const analyzerLambdaNodejs = new NodejsFunction(this, 'analyzerHandler', {
      functionName: 'cymotive-analyzer',
      entry: path.join(__dirname, './../services/Lambda/analyzer/analyzer.ts'),
      handler: 'handler',
      role: analyzerRole,
      environment: {
        TABLE: this.cymotiveTable.table.tableName,
      },
    });

    // analyzer Lambda Integration
    const analyzerLambdaIntegration = new LambdaIntegration(
      analyzerLambdaNodejs
    );

    // Create resource for analyzer Lambda (Resources / Method)
    // NumberOfAnomalies
    const analyzerLambdaResourceNumberOfAnomalies =
      this.api.root.addResource('numberofanomalies');
    analyzerLambdaResourceNumberOfAnomalies.addMethod(
      'Get',
      analyzerLambdaIntegration,
      { authorizationType: AuthorizationType.NONE }
    );

    // NumberOfReports
    const analyzerLambdaResourceNumberOfReports =
      this.api.root.addResource('numberofreports');
    analyzerLambdaResourceNumberOfReports.addMethod(
      'Get',
      analyzerLambdaIntegration,
      { authorizationType: AuthorizationType.NONE }
    );

    // NumberOfVehicle
    const analyzerLambdaResourceNumberOfVehicle =
      this.api.root.addResource('numberofvehicles');
    analyzerLambdaResourceNumberOfVehicle.addMethod(
      'Get',
      analyzerLambdaIntegration,
      { authorizationType: AuthorizationType.NONE }
    );

    // ***** analyzer Lambda *****
  }
}
