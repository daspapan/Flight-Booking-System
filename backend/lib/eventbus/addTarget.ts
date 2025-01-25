
import { Construct } from 'constructs';
import { Rule } from 'aws-cdk-lib/aws-events';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';

type EventBusProps = {
    appName: string;
    registerBooking?: NodejsFunction;
    emailReceipt?: NodejsFunction;
    syncFlights?: NodejsFunction;
    bookFlightRule: Rule;
    syncFlightRule: Rule;

}

export function createTarget(scope: Construct, props: EventBusProps) {

    if(props.registerBooking) props.bookFlightRule.addTarget(new LambdaFunction(props.registerBooking));
    if(props.emailReceipt) props.bookFlightRule.addTarget(new LambdaFunction(props.emailReceipt));

    if(props.syncFlights) props.syncFlightRule.addTarget(new LambdaFunction(props.syncFlights));
    
}