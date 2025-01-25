
import { Construct } from 'constructs';
import { ApiKey, ApiKeySourceType, AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { UserPool } from 'aws-cdk-lib/aws-cognito';

type APIGatewayProps = {
    appName: string;
    stageName: string;
    userPool: UserPool;
    bookingLambdaIntegration: LambdaIntegration;
    fetchFlightsLambdaIntegration: LambdaIntegration;
    fetchSeatsLambdaIntegration: LambdaIntegration;
    postsLambdaIntegration: LambdaIntegration;
    postLambdaIntegration: LambdaIntegration;
}

export function createAPIGateway(scope: Construct, props: APIGatewayProps) {

    const api = new RestApi(scope, `${props.appName}-FBSAPI`, {
        restApiName: `${props.appName}-FBS-API`,
        description: "This is a demo API for sending out random posts.",
        deployOptions: {
            stageName: props.stageName.toLocaleLowerCase() as string
        },
        defaultCorsPreflightOptions: {
            allowOrigins: ['*'],
            allowMethods: ['*'],
            allowHeaders: ['*'],
            allowCredentials: true,
        },
        apiKeySourceType: ApiKeySourceType.HEADER  
    });

    const apiKey = new ApiKey(scope, `${props.appName}-FBSApiKey`)

    const bookingResource = api.root.addResource("booking")
    const authorizer = new CognitoUserPoolsAuthorizer(scope, 'BookingAuthorizer', {
        cognitoUserPools: [props.userPool],
        authorizerName: 'FBSAuthorizer',
        identitySource: 'method.request.header.Authorization'
    });
    const optionsWithAuth:MethodOptions = {
        authorizationType: AuthorizationType.COGNITO,
        authorizer: {
            authorizerId: authorizer.authorizerId
        }
    };
    authorizer._attachToApi(api)
    bookingResource.addMethod('GET', props.bookingLambdaIntegration, optionsWithAuth);
    bookingResource.addMethod('POST', props.bookingLambdaIntegration, optionsWithAuth);

    const fetchFlightResource = api.root.addResource('flights')
    fetchFlightResource.addMethod('GET', props.fetchFlightsLambdaIntegration, optionsWithAuth);
    const fetchSeatsWithFlightIdResource = fetchFlightResource.addResource('{flightId}')
    fetchSeatsWithFlightIdResource.addMethod('GET', props.fetchSeatsLambdaIntegration, optionsWithAuth);



    /* const optionsWithApiKey:MethodOptions = {
        apiKeyRequired: true
    };  */ 
    // export API_KEY=lux1zl2x1l && aws apigateway get-api-key --api-key ${API_KEY} --include-value --query 'value' --output text
    /* const postsResource = api.root.addResource('posts');
    const postResource = postsResource.addResource('{id}');
    postsResource.addMethod('GET', props.postsLambdaIntegration);
    postsResource.addMethod('POST', props.postsLambdaIntegration);
    postResource.addMethod('GET', props.postLambdaIntegration);
    postResource.addMethod('DELETE', props.postLambdaIntegration);
 */
    return {api, apiKey}
    
}