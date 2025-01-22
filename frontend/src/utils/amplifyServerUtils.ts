import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { ResourcesConfig,AuthConfig } from '@aws-amplify/core';
import cdkOutput from '../../../cdk-outputs.json';

const output = cdkOutput[`FBS-Dev-Stack`]

const config: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || output.UserPoolId,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || output.UserPoolClientId,
            signUpVerificationMethod: "code"
        },
    },
}

export const { runWithAmplifyServerContext } = createServerRunner({
    config,
});