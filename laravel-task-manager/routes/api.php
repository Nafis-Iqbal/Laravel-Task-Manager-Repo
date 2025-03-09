<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ContentFilterController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('users/create', [UserController::class, 'createUser'])->name('user.create');
Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware(['auth:sanctum', 'verified', 'api'])->group(function () {
    Route::get('users', [UserController::class, 'getUsers'])->name('user.index');
    Route::get('users/{id}', [UserController::class, 'getUsers'])->name('user.show');
    Route::put('users/update', [UserController::class, 'updateUser'])->name('user.update');
    Route::delete('users/delete', [UserController::class, 'deleteUser'])->name('user.delete');

    Route::get('projects', [ProjectController::class, 'getProjects'])->name('projects.index');
    Route::get('projects/{id}', [ProjectController::class, 'getProjects'])->name('project.show');
    Route::post('projects/create', [ProjectController::class, 'createProject'])->name('project.create');
    Route::put('projects/update/{id}', [ProjectController::class, 'updateProject'])->name('project.update');
    Route::delete('projects/delete/{id}', [ProjectController::class, 'deleteProject'])->name('project.delete');

    Route::get('tasks', [TaskController::class, 'getTasks'])->name('task.index');
    Route::get('tasks/{id}', [TaskController::class, 'getTasks'])->name('task.show');
    Route::get('tasks/project/{projectId}', [TaskController::class, 'getTasksByProject'])->name('task.project_show');
    Route::get('tasks/{id}/tags', [TaskController::class, 'getTaskTags'])->name('task.tags');
    Route::post('tasks/create/{projectId}', [TaskController::class, 'createTask'])->name('task.create');
    Route::put('tasks/update/{id}', [TaskController::class, 'updateTask'])->name('task.update');
    Route::patch('tasks/update/tags', [TaskController::class, 'addTaskTag'])->name('task.update_tag');
    Route::patch('tasks/delete/tags', [TaskController::class, 'deleteTaskTag'])->name('task.update_tag');
    Route::delete('tasks/delete/{id}', [TaskController::class, 'deleteTask'])->name('task.delete');

    Route::get('tags', [TagController::class, 'getTags'])->name('tag.index');
    Route::post('tags/create', [TagController::class, 'createTag'])->name('tag.create');
    Route::put('tags/update/{id}', [TagController::class, 'updateTag'])->name('tag.update');
    Route::delete('tags/delete/{id}', [TagController::class, 'deleteTag'])->name('tag.delete');

    Route::get('comments/{task_id}', [CommentController::class, 'getComments'])->name('task.comments');
    Route::post('comments/create', [CommentController::class, 'createComment'])->name('comment.create');
    Route::delete('comments/delete/{comment_id}', [CommentController::class, 'deleteComment'])->name('comment.delete');

    Route::get('admin/users', [AdminController::class, 'getAdmins'])->name('admin.index');
    Route::get('admin/users/create', [AdminController::class, 'createUser'])->name('admin.create_user');
    Route::put('admin/users/update/{id}/role', [AdminController::class, 'updateUserRole'])->name('admin.update_user_role');
    Route::delete('admin/users/delete/{id}', [AdminController::class, 'deleteUser'])->name('admin.delete_user');
});

Route::get('filter_content', [ContentFilterController::class, 'getFilteredContent'])->name('filter_content');
