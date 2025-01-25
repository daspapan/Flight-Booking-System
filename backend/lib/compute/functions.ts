
import * as iam from 'aws-cdk-lib/aws-iam';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { EventBus } from 'aws-cdk-lib/aws-events';
// const path = require('path');
import path from 'path';

type CreateFunctionsProps = {
    appName: string;
    usersTable: Table;
    flightsTable: Table;
    seatsTable: Table;
    postsTable: Table;
    eventBus?: EventBus;
}


export function createFunctions(scope: Construct, props: CreateFunctionsProps){

    const addUserToTableFunc = new NodejsFunction(scope, `${props.appName}-AddUserToTableFunc`, {
        functionName: `${props.appName}-AddUserFunc`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/AddUserPostConfirmation/index.ts'
        ),
        environment: {
            USERS_TABLE_NAME: props.usersTable.tableName
        }
    });
    addUserToTableFunc.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:PutItem'
        ],
        resources: [
            props.usersTable.tableArn as string
        ]
    }))


    const bookSeats = new NodejsFunction(scope, `${props.appName}-BookSeats`, {
        functionName: `${props.appName}-BookSeats`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/Booking/index.ts'
        ),
        environment: {
            USERS_TABLE_NAME: props.usersTable.tableName,
            SEATS_TABLE_NAME: props.seatsTable.tableName,
            FLIGHTS_TABLE_NAME: props.flightsTable.tableName,
            EVENT_BUS_NAME: props.eventBus?.eventBusName as string
        }
    })
    bookSeats.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:PutItem',
            'dynamodb:GetItem',
            'events:PutEvents'
        ],
        resources: [
            props.usersTable.tableArn as string,
            props.seatsTable.tableArn as string,
            props.flightsTable.tableArn as string,
            props.eventBus?.eventBusArn as string,
        ]
    }))


    const fetchFlights = new NodejsFunction(scope, `${props.appName}-FetchFlights`, {
        functionName: `${props.appName}-FetchFlights`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/FetchFlights/index.ts'
        ),
        environment: {
            FLIGHTS_TABLE_NAME: props.flightsTable.tableName,
        }
    })
    fetchFlights.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:Scan',
        ],
        resources: [
            props.flightsTable.tableArn as string,
        ]
    }))

    const fetchSeats = new NodejsFunction(scope, `${props.appName}-FetchSeats`, {
        functionName: `${props.appName}-FetchSeats`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/FetchSeats/index.ts'
        ),
        environment: {
            SEATS_TABLE_NAME: props.seatsTable.tableName,
        }
    })
    fetchSeats.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:Query',
        ],
        resources: [
            props.seatsTable.tableArn as string,
        ]
    }))


    const registerBooking = new NodejsFunction(scope, `${props.appName}-RegisterBooking`, {
        functionName: `${props.appName}-RegisterBooking`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/RegisterBooking/index.ts'
        ),
        environment: {
            SEATS_TABLE_NAME: props.seatsTable.tableName
        }
    });
    registerBooking.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:*',
        ],
        resources: [
            props.seatsTable.tableArn as string,
        ]
    }))

    const syncFlights = new NodejsFunction(scope, `${props.appName}-SyncFlights`, {
        functionName: `${props.appName}-SyncFlights`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './func/SyncFlights/index.ts'
        ),
        environment: {
            SEATS_TABLE_NAME: props.seatsTable.tableName
        }
    });
    syncFlights.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:*',
        ],
        resources: [
            props.seatsTable.tableArn as string,
        ]
    }))

    const sendEmail = new NodejsFunction(scope, `${props.appName}-SendEmail`, {
        functionName: `${props.appName}-SendEmail`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(__dirname, `./func/SendBookingEmail/index.ts`),
        environment: {
            USERS_TABLE_NAME: props.usersTable.tableName,
            SEATS_TABLE_NAME: props.seatsTable.tableName,
            FLIGHTS_TABLE_NAME: props.flightsTable.tableName,
        }
    });
    sendEmail.addToRolePolicy(
        new iam.PolicyStatement({
            actions: ["ses:*", "dynamodb:*"],
            resources: [
                props.usersTable.tableArn as string,
                props.usersTable.tableArn + "/index/usernameIndex",
                "*",
            ],
        })
    );



    

    const postsLambda = new NodejsFunction(scope, `${props.appName}-PostsLambda`, {
        functionName: `${props.appName}-PostsLambda`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './resources/endpoints/posts.ts'
        ),
        environment: {
            POSTS_TABLE_NAME: props.postsTable.tableName
        }
    });
    postsLambda.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:*',
        ],
        resources: [
            props.postsTable.tableArn as string,
        ]
    }))

    const postLambda = new NodejsFunction(scope, `${props.appName}-PostLambda`, {
        functionName: `${props.appName}-PostLambda`,
        runtime: Runtime.NODEJS_18_X,
        handler: "handler",
        entry: path.join(
            __dirname,
            './resources/endpoints/post.ts'
        ),
        environment: {
            POSTS_TABLE_NAME: props.postsTable.tableName
        }
    });
    postLambda.addToRolePolicy(new iam.PolicyStatement({
        actions: [
            'dynamodb:*',
        ],
        resources: [
            props.postsTable.tableArn as string,
        ]
    })) 


    return { addUserToTableFunc, registerBooking, bookSeats, fetchFlights, fetchSeats, syncFlights, sendEmail, postsLambda, postLambda}

}