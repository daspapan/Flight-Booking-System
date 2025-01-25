import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { EventBus, Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

type EventBusProps = {
    appName: string;
    registerBooking?: NodejsFunction;
    emailReceipt?: NodejsFunction;
    syncFlights?: NodejsFunction;

}

export function createEventBus(scope: Construct, props: EventBusProps) {

    const eventBus = new EventBus(scope, `${props.appName}-EventBus`, {
        eventBusName: `${props.appName}-FlightBookingEventBus`
    });


    const bookFlightRule = new Rule(scope, `${props.appName}-BookFlightRule`, {
        eventBus: eventBus,
        eventPattern: {
            source: ['bookFlight'],
            detailType: ['flightBooked']
        }
    });


    const syncFlightRule = new Rule(scope, `${props.appName}-SyncFlightRule`, {
        schedule: Schedule.rate(cdk.Duration.days(1))
    });

    return {eventBus, bookFlightRule, syncFlightRule};
    
}