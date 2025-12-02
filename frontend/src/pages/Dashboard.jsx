import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import TaskCard from '../components/TaskCard';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/task/getalltask');
      // Adjust based on API response structure.
      // Assuming response.data.data.tasks or response.data.tasks
      // README says: GET /task/getalltask
      // Typical response: { status: 'success', results: n, data: { tasks: [...] } }
      const taskList = response.data.data?.tasks || response.data.tasks || [];
      setTasks(taskList);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
      toast.error("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        try {
            await api.delete(`/task/${id}`);
            toast.success("Task deleted successfully");
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            toast.error("Failed to delete task");
        }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading tasks...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>
        <Link to="/create-task" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition">
          + Create Task
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-xl">No tasks found.</p>
          <p>Get started by creating a new task!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
