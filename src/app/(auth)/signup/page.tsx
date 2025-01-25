import { AuthForm } from '../../../components/auth/authform'
import React from 'react'


const SignupPage = () => {
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mt-20">
                <AuthForm type="signup" />
            </div>
        </div>
    )
}

export default SignupPage