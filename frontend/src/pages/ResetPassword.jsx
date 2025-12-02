import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { token } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const password = watch('password', '');

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.patch(`/users/resetPassword/${token}`, {
          password: data.password,
          passwordConfirm: data.passwordConfirm
      });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
            })}
            error={errors.password}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            {...register('passwordConfirm', {
                required: 'Please confirm your password',
                validate: value => value === password || "Passwords do not match"
            })}
            error={errors.passwordConfirm}
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
