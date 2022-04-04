import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

// Api Gateway
import { RestApi, Cors, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export class StackCymotiveStack extends Stack {
  private api = new RestApi(this, 'cymotiveApi', {
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_ORIGINS,
    },
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
  }
}
