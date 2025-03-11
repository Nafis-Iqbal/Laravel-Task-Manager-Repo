import { useState } from "react";
import BasicButton from "./BasicButton";

export {};

const TagListRow = ({tag, onUpdate, onDelete} : {tag: Tag, onUpdate: (tag: Tag) => void, onDelete: (tag_id:number) => void}) => {
    const [tagTitle, setTagTitle] = useState<string>(tag.title);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagTitle(e.target.value);
    }

    return(
        <tr className="bg-gray-300 p-4 rounded-lg w-1/2 text-center border-b">
            <td className="text-red-900 font-semibold">
                {tag.title}
            </td>
            <td className="">
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={tag.title}
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </td>
            <td>
                <BasicButton
                    buttonText="Update Tag"
                    buttonColor="green-500"
                    textColor="white"
                    onClick={() => onUpdate({id: tag.id, title: tagTitle})}
                    customStyle="hover:bg-green-600"
                />
            </td>
            <td>
                <BasicButton
                    buttonText="Delete Tag"
                    buttonColor="red-500"
                    textColor="white"
                    onClick={() => onDelete(tag.id)}
                    customStyle="hover:bg-red-600"
                />
            </td>
        </tr>
    );
}

export default TagListRow;