import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { registerAction } from '../api/UserController';

const Register = () => {
  const [registerOption, setRegisterOption] = useState('emailPassword');
  const [message, setMessage] = useState(null);  // State for storing messages

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  // Initial values
  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  // Submit handler
  const onSubmit = async (values, { resetForm }) => {
    try {
      const response = await registerAction(values);
    
      if (response.responseCode === 201) {
        setMessage({ type: 'success', text: response.responseDescription });
        resetForm(); // Reset the form fields
      } else {
        setMessage({ type: 'error', text: response.responseDescription });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
  };

  const handleGoogleSignupSuccess = (response) => {
    console.log('Google signup success:', response);
  };

  const handleGoogleSignupFailure = (error) => {
    console.error('Google signup error:', error);
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Sign Up</h2>
          {/* Message Display */}
          {message && (
            <div className={`mb-4 text-center p-2 rounded-lg ${message.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
              {message.text}
            </div>
          )}
          <div className="flex justify-center mb-4">
            <button
              className={`px-4 py-2 rounded-l-lg ${registerOption === 'emailPassword' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setRegisterOption('emailPassword')}
            >
              Email & Password
            </button>
            <button
              className={`px-4 py-2 rounded-r-lg ${registerOption === 'google' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setRegisterOption('google')}
            >
              Google Account
            </button>
          </div>

          {registerOption === 'google' && (
            <div className="flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleSignupSuccess}
                onFailure={handleGoogleSignupFailure}
                text="signup_with"
                shape="pill"
                size="large"
              />
            </div>
          )}

          {registerOption === 'emailPassword' && (
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                    <div className="flex items-center border rounded-lg px-3 py-2">
                      <FiUser className="text-gray-400 mr-2" />
                      <Field
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="w-full p-2 focus:outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your First Name"
                      />
                    </div>
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                    <div className="flex items-center border rounded-lg px-3 py-2">
                      <FiUser className="text-gray-400 mr-2" />
                      <Field
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="w-full p-2 focus:outline-none dark:bg-gray-700 dark:text-white"
                        placeholder="Enter your Last Name"
                      />
                    </div>
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

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
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </Form>
              )}
            </Formik>
          )}

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:bg-blue-700">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
