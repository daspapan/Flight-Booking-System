import { AuthForm } from '../../../components/auth/authform';
import React from 'react'

const LoginPage = () => {
    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-xl lg:mt-20">
                <AuthForm type="login" />
            </div>
        </div>
    )
}

export default LoginPage