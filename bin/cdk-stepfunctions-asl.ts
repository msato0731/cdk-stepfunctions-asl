#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkStepfunctionsAslStack } from '../lib/cdk-stepfunctions-asl-stack';

const app = new cdk.App();
new CdkStepfunctionsAslStack(app, 'CdkStepfunctionsAslStack', {
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
});