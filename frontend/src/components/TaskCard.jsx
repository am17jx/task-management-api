import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const TaskCard = ({ task, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2 text-gray-800">{task.title}</h3>
      <p className="text-gray-600 mb-4">{task.description}</p>
      <div className="flex justify-between items-center mt-4">
        <div className={`text-xs font-semibold px-2 py-1 rounded ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
           {task.status || 'Pending'}
        </div>
        <div className="space-x-2">
            <Link to={`/edit-task/${task._id}`}>
                <Button className="bg-blue-500 hover:bg-blue-600 text-xs py-1 px-3">Edit</Button>
            </Link>
            <Button
                onClick={() => onDelete(task._id)}
                className="bg-red-500 hover:bg-red-600 text-xs py-1 px-3"
            >
                Delete
            </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
