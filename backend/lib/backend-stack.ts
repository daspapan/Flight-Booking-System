import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CDKContext } from '../types';
import { createTables } from './tables/dynamodb';
import { createAuth } from './auth/cognito';
import { createFunctions } from './compute/functions';
import { createAmplifyHosting } from './hosting/amplify';
import { createImagesBucket } from './storage/s3bucket';
import { createEventBus } from './eventbus/eventbus';
import { createTarget } from './eventbus/addTarget';
import { createAPIGateway } from './apigateway/api-stack';
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { createSES } from './notifications/topic';
// import { createSES } from './events/topic';

export class BackendStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: cdk.StackProps, context: CDKContext){
        super(scope, id, props);

        const appName = `${context.appName}-${context.stage}`;
        console.log(`AppName -> ${appName}`)


        // DynamoDB Setup
        const DynamoDBTables = createTables(this, {appName: appName});


        // Event Bus 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const eventBus = createEventBus(this, {
            appName: appName,
        });


        // NodejsFunction & LambdaFunction
        const computeStack = createFunctions(this, {
            appName: appName,
            usersTable: DynamoDBTables.usersTable,
            flightsTable: DynamoDBTables.flightsTable,
            seatsTable: DynamoDBTables.seatsTable,
            postsTable: DynamoDBTables.postsTable,
            eventBus: eventBus.eventBus
        });    


        // Event Bus - Add Target
        createTarget(this, {
            appName: appName,
            registerBooking: computeStack.registerBooking,
            emailReceipt: computeStack.sendEmail,
            syncFlights: computeStack.syncFlights,
            bookFlightRule: eventBus.bookFlightRule,
            syncFlightRule: eventBus.syncFlightRule
        })


        // Cognito Setup
        const auth = createAuth(this, {
            appName: appName, 
            usersTable: DynamoDBTables.usersTable,
            // hasCognitoGroups: true,
            // groupNames: ['Admin', 'Management'],
            addUserPostConfirmation: computeStack.addUserToTableFunc
        });


        // S3 Bucket
        const bucket = createImagesBucket(this, {
            appName: appName,
            authenticatedRole: auth.identityPool.authenticatedRole,
        })

        
        // API
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const api = createAPIGateway(this, {
            appName: appName,
            stageName: context.stage,
            userPool: auth.userPool,
            bookingLambdaIntegration: new LambdaIntegration(computeStack.bookSeats),
            postsLambdaIntegration: new LambdaIntegration(computeStack.postsLambda),
            postLambdaIntegration: new LambdaIntegration(computeStack.postLambda),
        })


        // SES Setup
        createSES(this, {appName: appName})


        /* console.log(JSON.stringify(context, null, 2))*/
		const amplifyHosting = createAmplifyHosting(this, {
			appName: appName,
			account: context.env.account,
			branch: context.branch,
			ghOwner: context.hosting.ghOwner,
			ghTokenName: context.hosting.ghTokenName,
			repo: context.hosting.repo,
			environmentVariables: {
				region: this.region,
                userPoolId: auth.userPool.userPoolId,
                userPoolClientId: auth.userPoolClient.userPoolClientId,
                identityPoolId: auth.identityPool.identityPoolId,
                apiKeyId: api.apiKey.keyId,
                apiUrl: api.api.url,
                bucketName: bucket.bucketName,
                flightsTable: DynamoDBTables.flightsTable.tableName,
                seatsTable: DynamoDBTables.seatsTable.tableName,
                usersTable: DynamoDBTables.usersTable.tableName,
                postsTable: DynamoDBTables.postsTable.tableName,
                NEXT_PUBLIC_AWS_REGION: this.region,
                NEXT_PUBLIC_AWS_ACCESS_KEY_ID: this.region,
                NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY: this.region,
                NEXT_PUBLIC_USER_POOL_ID: auth.userPool.userPoolId,
                NEXT_PUBLIC_USER_POOL_CLIENT_ID: auth.userPoolClient.userPoolClientId,
                NEXT_PUBLIC_IDENTITY_POOL_ID: auth.identityPool.identityPoolId,
                NEXT_PUBLIC_API_KEY_ID: api.apiKey.keyId,
                NEXT_PUBLIC_API_URL: api.api.url,
                NEXT_PUBLIC_BUCKET_NAME: bucket.bucketName,
                NEXT_PUBLIC_FLIGHTS_TABLE: DynamoDBTables.flightsTable.tableName,
                NEXT_PUBLIC_SEATS_TABLE: DynamoDBTables.seatsTable.tableName,
                NEXT_PUBLIC_USERS_TABLE: DynamoDBTables.usersTable.tableName,
                NEXT_PUBLIC_POSTS_TABLE: DynamoDBTables.postsTable.tableName,
			},
		})

        

        // AWS Settings
        new cdk.CfnOutput(this, 'Region', {value: this.region})
        // DynamoDB
        new cdk.CfnOutput(this, 'UsersTable', {value: DynamoDBTables.usersTable.tableName})
        new cdk.CfnOutput(this, 'FlightsTable', {value: DynamoDBTables.flightsTable.tableName})
        new cdk.CfnOutput(this, 'SeatsTable', {value: DynamoDBTables.seatsTable.tableName})
        new cdk.CfnOutput(this, 'PostsTable', {value: DynamoDBTables.postsTable.tableName}), 
        // Cognito
        new cdk.CfnOutput(this, 'UserPoolId', {value: auth.userPool.userPoolId})
        new cdk.CfnOutput(this, 'UserPoolClientId', {value: auth.userPoolClient.userPoolClientId})
        new cdk.CfnOutput(this, 'IdentityPoolId', {value: auth.identityPool.identityPoolId})
        // S3 Bucket
        new cdk.CfnOutput(this, 'BucketName', {value: bucket.bucketName})
        // API Endpoint
        new cdk.CfnOutput(this, 'ApiUrl', {value: api.api.url})
        new cdk.CfnOutput(this, 'ApiKeyId', {value: api.apiKey.keyId})
        // hosting
        new cdk.CfnOutput(this, 'AmplifyAppId', {value: amplifyHosting.appId})
        
    }
}