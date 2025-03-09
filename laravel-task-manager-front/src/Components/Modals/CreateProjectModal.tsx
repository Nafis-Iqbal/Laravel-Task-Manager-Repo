import { priority, statusEnum } from "../../Types&Enums/Enums";
import React, {useEffect, useState} from 'react';
import { useCreateProjectRQ } from "../../Services/API/ProjectApi";

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onSuccess,
}) => {

  const[formData, setFormData] = useState<Project>({
    id: 0,
    title: '',
    description: '',
    progress: 0,
    user_id: 1,
    status: statusEnum.active,
    end_Date: new Date(),
  });

  const {mutate: createProjectMutate} = useCreateProjectRQ(
    () => {
      onSuccess(formData);

      setFormData({
        id: 0,
        title: '',
        description: '',
        progress: 0,
        user_id: 1,
        status: statusEnum.active,
        end_Date: new Date(),
    });
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const{name, value} = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'end_Date' ? new Date(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit();
    createProjectMutate(formData);
    onClose();
  }

  const handleClose = () => {
    setFormData({
        id: 0,
        title: '',
        description: '',
        progress: 0,
        user_id: 1,
        status: statusEnum.active,
        end_Date: new Date(),
    });

    onClose();
  }

  if (!isOpen) return null;

    return(
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50">
        <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-4">Create Project</h2>
  
          <form onSubmit={(e) => handleSubmit(e)}> {/* Delegate form submission to parent */}
            {/* Task Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Project Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            {/* Task Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            {/* End Date Picker */}
            <div className="mb-4">
              <label htmlFor="end_Date" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                id="end_Date"
                name="end_Date"
                value={formData.end_Date.toISOString().split('T')[0]} // Convert Date to yyyy-mm-dd
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
  
            {/* Submit Button */}
            <div className="flex justify-between">
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Create Task
              </button>
            </div>
          </form>          
        </div>
      </div>
    );
}

export default CreateProjectModal;