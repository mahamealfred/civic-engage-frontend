import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Login = () => {
  const [loginOption, setLoginOption] = useState('emailPassword');

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Initial values
  const initialValues = {
    email: '',
    password: '',
  };

  // Submit handler
  const onSubmit = (values) => {
    console.log('Form data', values);
  };

  const handleGoogleLoginSuccess = (response) => {
    console.log('Google login success:', response);
  };

  const handleGoogleLoginFailure = (error) => {
    console.error('Google login error:', error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Login</h2>

          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-l-lg ${loginOption === 'emailPassword' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setLoginOption('emailPassword')}
            >
              Email & Password
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${loginOption === 'google' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setLoginOption('google')}
            >
              Google Account
            </button>
          </div>

          {loginOption === 'google' && (
            <div className="flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onFailure={handleGoogleLoginFailure}
                text="signin_with"
                shape="pill"
                size="large"
              />
            </div>
          )}

          {loginOption === 'emailPassword' && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <div className="flex items-center border rounded-lg px-3 py-2">
                      <FiMail className="text-gray-400 mr-2" />
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        className="w-full p-2 focus:outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your email"
                      />
                    </div>
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <div className="flex items-center border rounded-lg px-3 py-2">
                      <FiLock className="text-gray-400 mr-2" />
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        className="w-full p-2 focus:outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your password"
                      />
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <div className="text-center mt-4">
            <p className="text-gray-700 dark:text-gray-300">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-500 over:bg-blue-700">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
