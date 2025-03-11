export const NoContentTableRow = ({displayMessage, tdColSpan} : {displayMessage: string, tdColSpan: number}) => {
    return (
        <tr className="text-center bg-red-200">
            <td className="h-10" colSpan={tdColSpan}>{displayMessage}</td>
        </tr>
    )
}