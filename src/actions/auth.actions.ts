import {
    signUp,
    confirmSignUp,
    autoSignIn,
    signIn,
    getCurrentUser,
    signOut,
    type SignInInput,
    type ConfirmSignUpInput,
    // ConfirmSignInOutput,
} from "aws-amplify/auth";
import { redirect } from "next/navigation";
  
type SignUpParameters = {
    email: string;
    password: string;
    name: string;
};
  
export async function handleSignUp({
    email,
    password,
    name,
}: SignUpParameters): Promise<string | undefined> {
    console.log("signing up", email, password, name);
    try {
        const { userId } = await signUp({
            username: email,
            password,
            options: {
                userAttributes: {
                    name,
                },
            },
        });
        console.log("userId", userId);
        return userId;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.log("error signing up:", error.name);
        throw error;
    }
}
  
export async function handleSignUpConfirmation({
    username,
    confirmationCode,
}: ConfirmSignUpInput): Promise<boolean> {
    try {
        const { isSignUpComplete, nextStep } = await confirmSignUp({
            username,
            confirmationCode,
        });
        console.log("isSignUpComplete", isSignUpComplete, nextStep);
        return true;
    } catch (error) {
        console.log("error confirming sign up", error);
        throw error;
    }
}
  
export async function handleAutoSignIn() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const signInOutput = await autoSignIn();
        // handle sign-in steps
    } catch (error) {
        console.log(error);
        throw error;
    }
}
  
export async function handleSignIn({ username, password }: SignInInput) {
    try {
        const { isSignedIn, nextStep } = await signIn({ username, password });
        console.log("isSignedIn", isSignedIn);
        console.log("nextStep", nextStep);
    } catch (error) {
        console.log("error signing in", error);
    }
}
  
export async function currentAuthenticatedUser() {
    try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        console.log(`The userId: ${userId}`);
        console.log(`The signInDetails: ${signInDetails}`);
    } catch (err) {
        console.log(err);
    }
}
  
export async function handleSignOut() {
    try {
        await signOut();
        redirect("/");
    } catch (error) {
        console.log("error signing out: ", error);
    }
}
  