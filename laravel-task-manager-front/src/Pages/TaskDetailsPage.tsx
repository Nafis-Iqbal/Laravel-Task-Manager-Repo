import { useState } from "react";
import { useNavigate , useParams} from "react-router-dom";
import { Plus, X, Image } from "lucide-react";
import { generateFakeComments } from "../Utilities/FakeData";

//const isDebugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true';
const isDebugMode = true;

let commentsData: Comments[] = [];

if(isDebugMode === true){
  commentsData = generateFakeComments(3);
}

const TaskDetailsPage = () => {
  console.log(import.meta.env);
  const [comments, setComments] = useState<Comments[]>(commentsData);

  const [newComment, setNewComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([
    "https://via.placeholder.com/300",
    "https://via.placeholder.com/350",
  ]);

  const taskId = useParams();

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setComments([...comments, { id: comments.length + 1, text: newComment }]);
    setNewComment("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Details</h1>

      {/* Comments Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Comments</h2>
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment.id} className="p-3 bg-gray-50 rounded-md shadow-sm">
              {comment.text}
            </li>
          ))}
        </ul>

        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded-md"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>

      {/* Image Buttons */}
      <div className="flex mt-6 gap-4">
        {/* Show Photos Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          <Image className="w-5 h-5" />
          Show Photos
        </button>

        {/* Add Photo Button */}
        <button className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
          <Plus className="w-5 h-5" />
          Add Photo
        </button>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Task Images</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            {/* Scrollable Image List */}
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {images.map((img, index) => (
                <img key={index} src={img} alt={`Task Image ${index + 1}`} className="w-full rounded-lg shadow-md" />
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetailsPage;
