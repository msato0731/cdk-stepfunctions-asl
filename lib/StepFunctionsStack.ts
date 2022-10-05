import * as cdk from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions'
import * as fs from 'fs'
import { Construct } from 'constructs'

export class StepfunctionsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const file = fs.readFileSync('./step-functions/HelloWorld.asl.json')

    //  ステートマシン作成にIAM Role必須のため、今回の検証ではポリシーは不要
    const role = new iam.Role(this, "StepFunctionsRole", {
      assumedBy: new iam.ServicePrincipal('states.amazonaws.com')
    })

    new stepfunctions.CfnStateMachine(this, 'HelloWorldStateMachine', {
      definitionString: file.toString(),
      stateMachineName: 'HelloWorld-CDK',
      roleArn: role.roleArn
    })

  }
}
