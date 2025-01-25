import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { ResourcesConfig } from '@aws-amplify/core';
import cdkOutput from '../../cdk-outputs.json';

const output = cdkOutput[`FBS-Dev-Stack`]

const config: ResourcesConfig = {
    Auth: {
        Cognito: {
            userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || output.userPoolId,
            userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || output.userPoolClientId,
            identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID || output.identityPoolId,
            signUpVerificationMethod: "code"
        },
    },
}

export const { runWithAmplifyServerContext } = createServerRunner({
    config,
});