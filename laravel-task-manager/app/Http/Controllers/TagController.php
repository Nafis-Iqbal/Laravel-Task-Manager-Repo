<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tag;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class TagController extends Controller
{
    public function getTags()
    {
        $tags = Tag::all();

        return response()->json([
            'message' => 'Tags retrieved successfully',
            'status' => 'success',
            'data' => $tags
        ]);
    }

    public function createTag(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|min:3|max:10|unique:tags,title'
        ]);

        $tag = new Tag();
        $tag->title = $validatedData['title'];
        $tag->save();

        return response()->json([
            'message' => 'Tag created successfully',
            'status' => 'success'
        ]);
    }

    public function updateTag(Request $request, $id)
    {
        $validatedData = $request->validate([
            'title' => 'required|min:3|max:10|unique:tags,title'
        ]);

        try {
            $tag = Tag::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Tag not found.',
                'status' => 'failed'
            ]);
        }

        $tag->update(['title' => $validatedData['title']]);

        return response()->json([
            'message' => 'Tag updated successfully',
            'status' => 'success'
        ]);
    }

    public function deleteTag($id)
    {
        try {
            $tag = Tag::findOrFail($id);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Tag not found.',
                'status' => 'failed'
            ]);
        }

        $tag->delete();

        return response()->json([
            'message' => 'Tag deleted successfully',
            'status' => 'success'
        ]);
    }
}
