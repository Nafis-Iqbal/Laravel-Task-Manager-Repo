import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { queryClient } from '../Services/API/ApiInstance';
import { useGetTagsRQ, useDeleteTagRQ, useUpdateTagRQ } from '../Services/API/TagApi';

import UserInfo from '../Components/UserInfo';
import BasicTextDiv from '../Components/CustomDivElements';
import CreateTagModal from '../Components/Modals/CreateTaskTagModal';
import LoadingModal from '../Components/Modals/LoadingContentModal';
import NotificationPopUp from '../Components/Modals/NotificationPopUpModal';
import ProfilePicture from '../Components/StructureComponents/ProfilePicture';
import { TableDataBlock } from '../Components/ElementComponents/TableDataBlock';
import ProfileHeroSection from '../Components/StructureComponents/ProfileHeroSection';
import BasicButton from '../Components/ElementComponents/BasicButton';

const ProfilePage: React.FC = () => {
  const [tagsData, setTagsData] = useState<Tag[]>([]);
  const [tagsFetchMessage, setTagsFetchMessage] = useState<string>("");
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const [loadingContentOpen, setLoadingContentOpen] = useState(false);
  const [notificationPopupOpen, setNotificationPopupOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string>("");
  const [profilePicture, setProfilePicture] = useState<string>('default_picture_url');

  const {data: tagsDataAll, isLoading: tagsDataLoading} = useGetTagsRQ(
    () => {
      console.log(tagsDataAll);
      setTagsData(tagsDataAll?.data.data);
      if(tagsDataAll?.data.data.length < 1){
        setTagsFetchMessage("No projects to show.");
      }
    },
    () => {
      setTagsFetchMessage("Failed to Load tags.");
    }
  );

  const {mutate: updateTagMutate} = useUpdateTagRQ(
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Tag updated successfully.");

      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Failed to update tag. Try again");
    }
  );

  const {mutate: deleteTagMutate} = useDeleteTagRQ(
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Tag deleted successfully.");

      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    () => {
      setLoadingContentOpen(false);
      openNotificationPopUpMessage("Failed to delete tag. Try again");
    }
  );

  useEffect(() => {
    setTagsData(tagsDataAll?.data.data);
  }, [tagsDataAll]);

  const openCreateTagForm = () => {
    setIsCreateTagOpen(false);
  }

  const onCreateTagSubmit = () => {
    setLoadingContentOpen(true);
  }

  const onCreateTagSuccess = (formData: Tag) => {
    setLoadingContentOpen(false);

    openNotificationPopUpMessage("Tag created successfully!");

    if(tagsData)
    {
      setTagsData((prevTags) => [
        ...prevTags,
        {
          id: formData.id, // Generate a new task ID
          title: formData.title,
        }
      ]);
    }
  }

  const onCreateTagFailure = () => {
    setLoadingContentOpen(false);
    openNotificationPopUpMessage("Error creating task tag!");
  }

  const onTagUpdate = (id: number, title: string) => {

  }

  const onTagDelete = (tag_id: number) => {
    setLoadingContentOpen(true);
    deleteTagMutate(tag_id);
  }

  const openNotificationPopUpMessage = (popUpMessage: string) => {
    setNotificationPopupOpen(true);
    setNotificationMessage(popUpMessage);
  }

  return (
    <div className="p-8 min-h-screen space-y-4 bg-gray-200">
      <ProfileHeroSection />
      
      <div className="relative flex justify-left items-center bg-gray-100 rounded-lg pt-4 pb-4">
        <ProfilePicture src={profilePicture}/>
      </div>

      <UserInfo />

      <CreateTagModal
        isOpen={isCreateTagOpen}
        onClose={() => setIsCreateTagOpen(false)}
        onSubmit={onCreateTagSubmit}
        onSuccess={onCreateTagSuccess}
        onFailure={onCreateTagFailure}
      />

      <NotificationPopUp
        isOpen = {notificationPopupOpen}
        onClose = {() => setNotificationPopupOpen(false)}
        message = {notificationMessage}
      />

      <LoadingModal
        isOpen = {loadingContentOpen}
      />

      <div className="flex space-x-2">
        <Link to="/projects">
          <BasicTextDiv
            displayText='Show Projects'
            customStyle='rounded-lg bg-green-500 text-white p-3'
          />
        </Link>
        <Link to="/tasks">
          <BasicTextDiv
            displayText='Show Tasks'
            customStyle='rounded-lg bg-green-500 text-white p-3'
          />
        </Link>
      </div >

      {/* Tag Creation Panel */}
      <div className="relative flex flex-col justify-left bg-gray-100 rounded-lg pt-4 pb-4">
        <h1 className="text-gray-800 pl-3 pb-2 font-bold text-xl">Tag Manager</h1>
        <table className="w-full border-collapse space-y-1">
          <thead>
            <tr className="bg-gray-400 w-full">
              <th className="px-4 py-2 w-2/10 rounded-tl-md">Tag Title</th>
              <th className="px-4 py-2 w-4/10">Edit</th>
              <th className="px-4 py-2 w-2/10">Actions</th>
              <th className="px-4 py-2 w-2/10 rounded-tr-md">
                <BasicButton
                  buttonText="Create New Tag"
                  buttonColor="green-600"
                  textColor="white"
                  onClick={() => openCreateTagForm()}
                  customStyle="hover:bg-green-700"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            <TableDataBlock
              dataList={tagsData}
              isDataLoading={tagsDataLoading}
              dataFetchMessage={tagsFetchMessage}
              noContentColSpan={4}
              onDataUpdate={(tag: Tag) => updateTagMutate(tag)}
              onDataDelete={(id: number) => deleteTagMutate(id)}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfilePage;
