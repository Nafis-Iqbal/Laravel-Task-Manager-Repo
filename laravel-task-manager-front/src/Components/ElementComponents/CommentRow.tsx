import BasicButton from "./BasicButton";
import LoadingSpinnerBlock from "../LoadingSpinnerBlock";
import { useState } from "react";

export const CommentRow = ({comment_id, commentText, onDelete}:{comment_id: number, commentText: string, onDelete: () => void}) => {
    const [isSpinnerActive, setIsSpinnerActive] = useState(false);

    const handleDelete = () => {
        setIsSpinnerActive(true);
        onDelete();
    }

    return (
        <div className="flex justify-between items-center bg-gray-100 rounded-lg">
            <p className="ml-4">{commentText}</p>

            <div className="flex">
                <LoadingSpinnerBlock
                    customStyle="h-[25px] mr-4"
                    isOpen={isSpinnerActive}
                />
                <BasicButton
                    buttonText="Delete"
                    buttonColor="red-500"
                    textColor="white"
                    onClick={handleDelete}
                    value={comment_id}
                    customStyle="mr-1"
                />
            </div>
        </div>
    );
}