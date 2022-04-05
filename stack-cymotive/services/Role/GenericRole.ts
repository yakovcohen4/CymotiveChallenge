import { Stack } from 'aws-cdk-lib';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';

export class GenericRole {
  private name: string;
  private policies: string[];
  private stack: Stack;
  public role: Role;

  public constructor(name: string, policies: string[], stack: Stack) {
    this.name = name;
    this.policies = policies;
    this.stack = stack;
    this.initialize();
  }

  private initialize() {
    this.createRole();
  }

  private createRole() {
    this.role = new Role(this.stack, this.name, {
      roleName: this.name,
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: this.policies.map(policy =>
        ManagedPolicy.fromAwsManagedPolicyName(policy)
      ),
    });
  }
}
