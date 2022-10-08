import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions'
import { GithubActionsIdentityProvider, GithubActionsRole } from 'aws-cdk-github-oidc';
import * as fs from 'fs'
import { Construct } from 'constructs'

export class StepfunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    // すでにProvider作成済みのため
    const provider = GithubActionsIdentityProvider.fromAccount(this, this.account)

    // Provider存在しない場合は、以下の記述が必要
    // const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');

    const githubActionsRole = new GithubActionsRole(this, 'GithubActionsRole', {
      provider: provider,
      owner: 'msato0731', // 書き換え必要
      repo: 'cdk-stepfunctions-asl',
      roleName: 'stepfunctions-gh-deploy-test',
      maxSessionDuration: cdk.Duration.hours(2),
    });

    // デプロイ検証用のため強めの権限付与
    githubActionsRole.addManagedPolicy( iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess") )

    new cdk.CfnOutput(this, "GithubActionsRoleArn", {
      value: githubActionsRole.roleArn
    })

    const file = fs.readFileSync('./step-functions/HelloWorld.asl.json')

    //  ステートマシン作成にIAM Role必須のため、今回の検証ではポリシーは不要
    const stepFunctionsRole = new iam.Role(this, "StepFunctionsRole", {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com')
    })

    new stepfunctions.CfnStateMachine(this, 'HelloWorldStateMachine', {
      definitionString: file.toString(),
      stateMachineName: 'HelloWorld-CDK',
      roleArn: stepFunctionsRole.roleArn
    })

  }
}
