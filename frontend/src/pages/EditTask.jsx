import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditTask = () => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/task/${id}`);
        // Adjust based on API response structure.
        const task = response.data.data?.task || response.data.task;
        if (task) {
            setValue('title', task.title);
            setValue('description', task.description);
            setValue('status', task.status);
        }
      } catch (error) {
        toast.error("Failed to load task details");
        navigate('/');
      } finally {
        setIsFetching(false);
      }
    };
    fetchTask();
  }, [id, setValue, navigate]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await api.patch(`/task/${id}`, data);
      toast.success('Task updated successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
      return <div className="flex justify-center items-center h-screen">Loading task details...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Task</h2>
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
                Update Task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
