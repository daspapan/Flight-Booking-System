// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as gitBranch from 'git-branch';
import cdkOutput from './cdk-outputs.json';
import cdkContext from './backend/cdk.context.json';



console.log(cdkOutput);
console.log(cdkContext); // globals->appName
const currentBranch = process.env.AWS_BRANCH || gitBranch.sync();
console.log(currentBranch);

const output = cdkOutput[`FBS-Dev-Stack`]

export const config = {
	Auth: {
		Cognito: {
			UserPoolId: process.env.UserPoolId || output.UserPoolId,
			UserPoolClientId: process.env.UserPoolClientId || output.UserPoolClientId,
		},
	},
	Database: {
		DynamoDB: {
			FlightsTable: output.FlightsTable,
			UsersTable: output.UsersTable,
			SeatsTable: output.SeatsTable
		}
	}
}
