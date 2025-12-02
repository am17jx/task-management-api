import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/users/forgetPassword', { email: data.email });
      toast.success('Password reset email sent!');
      setIsSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSent) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-green-600">Email Sent!</h2>
                <p className="text-gray-700 mb-6">Check your email for instructions to reset your password.</p>
                <Link to="/login" className="text-blue-500 hover:text-blue-700 font-bold">Back to Login</Link>
            </div>
        </div>
      )
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>
        <p className="mb-4 text-gray-600 text-sm text-center">Enter your email address and we'll send you a link to reset your password.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email', { required: 'Email is required' })}
            error={errors.email}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Link
          </Button>
        </form>
         <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-500 hover:text-blue-700 font-bold">Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
