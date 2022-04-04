import { Stack } from 'aws-cdk-lib';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class GenericBucket {
  private name: string;
  private stack: Stack;
  public bucket: Bucket;

  public constructor(name: string, stack: Stack) {
    this.name = name;
    this.stack = stack;
    this.initialize();
  }

  private initialize() {
    this.createBucket();
  }

  private createBucket() {
    this.bucket = new Bucket(this.stack, this.name, {
      versioned: false,
      bucketName: this.name,
      publicReadAccess: true,
      websiteIndexDocument: 'Index.html',
    });
  }
}
