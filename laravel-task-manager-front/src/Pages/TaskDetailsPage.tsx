import { useEffect, useState, useCallback, useRef } from "react";
import { useParams} from "react-router-dom";
import { Plus, X, Image } from "lucide-react";

import { generateFakeComments, generateFakeTags } from "../Utilities/FakeData";
import debounce from "lodash/debounce";
import { queryClient } from "../Services/API/ApiInstance";
import { useGetTasksRQ, useGetTaskTagsRQ, useAddTaskTags, useDeleteTaskTags } from "../Services/API/TaskApi";
import { useAddCommentsRQ, useDeleteCommentsRQ, useGetCommentsRQ } from "../Services/API/CommentApi";
import { useGetTagsRQ } from "../Services/API/TagApi";

import SelectTagInput from "../Components/ElementComponents/SelectInput";
import BasicButton from "../Components/ElementComponents/BasicButton";
import PhotoDisplayModal from "../Components/Modals/PhotoModal";
import TaskDetailHeroSection from "../Components/StructureComponents/TaskHeroSection";
import { CommentRow } from "../Components/ElementComponents/CommentRow";
import LoadingSpinnerBlock from "../Components/LoadingSpinnerBlock";
import { TableDataBlock } from "../Components/ElementComponents/TableDataBlock";

const isDebugMode: boolean = false;
const maxTagsPerTask: number = 10;

let commentsData: Comments[] = [];
let initialTagsData: Tag[] = [];
let taskTags: Tag[] = [];
let imageFiles: string[] = [
  "https://via.placeholder.com/300",
  "https://via.placeholder.com/350",
];

if(isDebugMode){
  commentsData = generateFakeComments(3);
  initialTagsData = generateFakeTags(15);
}

const TaskDetailsPage = () => {
  const [taskDetailData, setTaskDetailData] = useState<Task>();
  const [selectTagMode, setSelectTagMode] = useState(false);
  const [tagsData, setTagsData] = useState<Tag[]>(initialTagsData);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(taskTags);
  const [isTagDataSyncing, setIsTagDataSyncing] = useState(false);
  const [comments, setComments] = useState<Comments[]>(commentsData?? []);
  const [taskCommentsFetchMessage, setTaskCommentsFetchMessage] = useState<string>("");
  const [newComment, setNewComment] = useState("");
  const tagsToDeleteRef = useRef<number[]>([]);

  const [isShowPhotoOpen, setIsShowPhotoOpen] = useState(false);
  const [images, setImages] = useState<string[]>(imageFiles);

  const {taskId} = useParams();
  const taskIdNumber = Number(taskId);

  //[[HOOKS]]
  //GET => FETCH QUERIES
  const {data: taskDetail} = useGetTasksRQ(
    taskIdNumber, 
    () => {
      setTaskDetailData(taskDetail?.data.data);
    },
    () => {

    }
  );

  const {data: tagsDataAll} = useGetTagsRQ(
    () => {
      setTagsData(tagsDataAll?.data.data);
    },
    () => {

    }
  );

  const {data: taskTagsData} = useGetTaskTagsRQ(
    taskIdNumber,
    () => {
      setSelectedTags(taskTagsData?.data.data);
    },
    () => {

    }
  );

  const {data: taskComments, isLoading: taskCommentsLoading} = useGetCommentsRQ(
    taskIdNumber, 
    () => {
      setComments(taskComments?.data.data);
      if(taskComments?.data.data.length < 1){
        setTaskCommentsFetchMessage("No comments to show.");
      }
    },
    () => {
      setTaskCommentsFetchMessage("Failed to load comments.");
    }
  );

  //UPDATE + PATCH + DELETE => MUTATIONS
  const {mutate: addTaskTagsMutate} = useAddTaskTags(
    () => {
      setIsTagDataSyncing(false);
      queryClient.invalidateQueries(["tags", taskIdNumber]);
    },
    () => {

    }
  );

  const debouncedAddTaskTags = useCallback(
    debounce((taskId: number, taskTags: Tag[]) => {
      addTaskTagsMutate({ task_id: taskId, task_tags: taskTags.map((task_tag) => task_tag.id) });
    }, 500),
    []
  );

  const {mutate: deleteTaskTagsMutate} = useDeleteTaskTags(
    () => {
      setIsTagDataSyncing(false);
      queryClient.invalidateQueries(["tags", taskIdNumber]);
    },
    () => {

    }
  );

  const debouncedDeleteTaskTags = useCallback(
    debounce((taskId: number, taskTags: number[]) => {
      deleteTaskTagsMutate({ task_id: taskId, task_tags: taskTags });
    }, 500),
    []
  );

  const {mutate: addTaskCommentMutate, isLoading} = useAddCommentsRQ(
    () => {
      setComments([...comments, { id: comments.length + 1, comment: newComment }]);
      setNewComment("");
    },
    () => {

    }
  );

  const {mutate: deleteCommentMutate} = useDeleteCommentsRQ(
    () => {
      queryClient.invalidateQueries(["comments", taskIdNumber]);
    },
    () => {
      
    }
  );

  useEffect(() => {
    setTaskDetailData(taskDetail?.data.data);
    setTagsData(tagsDataAll?.data.data);
    setComments(taskComments?.data.data);
    setSelectedTags(taskTagsData?.data.data);
  }, [taskDetail, tagsDataAll, taskComments, taskTagsData]);
  
  //FUNCTION CALLS
  const addTaskTag = (tag: Tag | undefined) => {
    if(tag && selectedTags.length < maxTagsPerTask)
    {
      if(selectedTags.some(tagM => tagM.id === tag.id) === false)
      {
        setSelectedTags((prevTags) => ([
          ...prevTags,
          {id: tag.id, title: tag.title}
        ]));
        setIsTagDataSyncing(true);

        //lodash
        debouncedAddTaskTags(taskIdNumber, [...selectedTags, {id: tag.id, title: tag.title}]);
      }
    }
  };

  const removeTaskTag = (tag_id: number) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tag_id));

    setIsTagDataSyncing(true);
    tagsToDeleteRef.current = [...tagsToDeleteRef.current, tag_id];

    debouncedDeleteTaskTags(taskIdNumber, tagsToDeleteRef.current);
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isLoading) return;

    addTaskCommentMutate({task_id: taskIdNumber, comment: newComment});
  };

  //For Tag selection Select Input mode
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(selectedTags.length < maxTagsPerTask)
    {
      if(selectedTags.some(tagM => tagM.id === Number(e.target.value)) === false)
      {
        let tagName: string = tagsData.find(tagM => tagM.id === Number(e.target.value))?.title ?? "";

        setSelectedTags((prevTags) => ([
          ...prevTags,
          {id: Number(e.target.value), title: tagName}
        ]));
      }
    }
  };

  return (
    <div className="max-w-4xl min-h-screen mx-auto p-6 bg-gray-300 rounded-lg shadow-md">
      <TaskDetailHeroSection
        task_title={taskDetailData ? taskDetailData.title : "Noob"}
        task_id={taskIdNumber}
        project_title="GG"
        project_id={taskDetailData ? taskDetailData.project_id : 0}
        userName="Nafis"
        user_id={taskDetailData ? taskDetailData.user_id : 0}
        customStyle="mb-4 bg-blue-200"
      />
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Task Details</h1>


      <div className="flex flex-col bg-white p-4 rounded-lg shadow mb-4">
        {/* Task Tags Header */}
        <div className="bg-gray-50 w-1/5 p-3 mb-1 text-lg font-bold rounded-lg">Task Tags</div>

        {/* Task Tags */}
        <div className="h-[100px] gap-2 contain-content bg-white rounded-lg border-gray-100 border-2 mb-2">
          {selectedTags && selectedTags.length > 0 && selectedTags.map((tag) => (
            <div className="relative p-2 mr-1 mt-1 inline-block text-white bg-green-500 rounded-md" key={tag.id}>
              {tag.title}
              <BasicButton
                buttonText="X"
                buttonColor="red-500"
                customStyle="absolute -top-1 -right-1 w-2 h-2 rounded-full text-xs flex items-center justify-center hover:bg-red-700"
                onClick={() => removeTaskTag(tag.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-row h-[100px] justify-between">
          {/* Tag Selection Button mode*/}
          {!selectTagMode && (
            <div className="w-9/10 h-[100px] contain-content gap-2 bg-white rounded-lg border-gray-100 border-2 mb-2 mr-2">
              {tagsData && tagsData.length > 0 && tagsData.map((tag) => (
                <BasicButton
                  key = {tag.id}
                  buttonText={tag.title}
                  buttonColor="red-500"
                  textColor="white"
                  onClick={addTaskTag}
                  customStyle="mb-1 mt-1 mr-1"
                  value={tag}
                />
              ))}
            </div>
          )}
          
          {/* Tag Selection Select mode*/}
          {selectTagMode && (
            <div className="w-9/10 mr-2">
              <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                <div className="mt-1 w-1/2 ml-2 mr-2 text-white block px-4 py-2 border bg-red-500 rounded-md">
                  {<p>Add Tag</p>}
                </div>
              
                <SelectTagInput
                  tags={(tagsData && tagsData.length > 0)? tagsData: []}
                  id="tag"
                  name="tag"
                  value={(tagsData && tagsData.length > 0)? tagsData[0].id: 0}
                  onChange={handleChange}
                  className="mt-1 block w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <BasicButton
              buttonText="Switch"
              textColor="white"
              buttonColor="green-500"
              onClick={() => {setSelectTagMode(!selectTagMode)}}
              customStyle="h-[40px]"
            />

            <LoadingSpinnerBlock
              customStyle="h-[50px]"
              isOpen={isTagDataSyncing}
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Comments</h2>
        <ul className="space-y-2">
          <TableDataBlock
            dataList={comments}
            isDataLoading={taskCommentsLoading}
            dataFetchMessage={taskCommentsFetchMessage}
            onDataDelete={(id: number) => deleteCommentMutate(id)}
          />
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
          onClick={() => setIsShowPhotoOpen(true)}
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
      {isShowPhotoOpen && (
        <PhotoDisplayModal
          images={imageFiles}
          onClose={() => setIsShowPhotoOpen(false)}
        />
      )}
    </div>
  );
};

export default TaskDetailsPage;
