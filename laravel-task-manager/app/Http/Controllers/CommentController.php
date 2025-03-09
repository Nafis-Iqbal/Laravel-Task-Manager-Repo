<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Comment;
use App\Models\Task;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CommentController extends Controller
{
    public function getComments($task_id)
    {
        $task = Task::findOrFail($task_id);

        if ($task->user_id == Auth::id()) {
            $comments = Comment::where("task_id", $task_id)->get()->toArray();

            return response()->json([
                'message' => 'Comments retrieved successfully',
                'status' => 'success',
                'data' => $comments
            ]);
        } else {

            return response()->json([
                'message' => 'Unauthorized access to task',
                'status' => 'failed',
            ]);
        }
    }

    public function createComment(Request $request)
    {
        $validatedData = $request->validate([
            'comment' => 'required|min:3|max:100',
            'task_id' => 'required|numeric'
        ]);

        $userId = Auth::id();

        $comment = new Comment();
        $comment->comment = $validatedData['comment'];
        $comment->task_id = $request->input('task_id');
        $comment->user_id = $userId;

        $comment->save();

        return response()->json([
            'message' => 'Comment added successfully',
            'status' => 'success'
        ]);
    }

    public function deleteComment($comment_id)
    {
        try {
            $comment = Comment::findOrFail($comment_id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Comment not found.',
                'status' => 'failed'
            ]);
        }

        $comment->delete();

        return response()->json([
            'message' => 'Comment deleted successfully',
            'status' => 'success'
        ]);
    }
}
