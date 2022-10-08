#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { StepfunctionsStack } from '../lib/StepFunctionsStack';

const app = new cdk.App();
new StepfunctionsStack(app, 'StepfunctionsStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: 'ap-northeast-1',
    },
});
