import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-toastify';

const CreateTask = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.post('/task/createtask', data);
      toast.success('Task created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Task</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Title"
            type="text"
            placeholder="Task Title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title}
          />
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.description ? 'border-red-500' : ''}`}
              rows="4"
              placeholder="Task Description"
              {...register('description', { required: 'Description is required' })}
            ></textarea>
             {errors.description && <p className="text-red-500 text-xs italic mt-1">{errors.description.message}</p>}
          </div>

          <div className="mb-4">
             <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
             <select
                {...register('status')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
             >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
             </select>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
                type="button"
                className="bg-gray-500 hover:bg-gray-600"
                onClick={() => navigate('/')}
            >
                Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
                Create Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
