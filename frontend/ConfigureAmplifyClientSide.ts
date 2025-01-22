"use client";

import { Amplify } from "aws-amplify";
import { ResourcesConfig } from "@aws-amplify/core";
import cdkOutput from '../cdk-outputs.json';

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

Amplify.configure(config, {ssr: true})

export default function ConfigureAmplifyClientSide(){
    return null
}