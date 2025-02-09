<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TagController;
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

Route::post('create_user', [UserController::class, 'createUser'])->name('create_user');
Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('users', [UserController::class, 'getUsers'])->name('user.index');
    Route::get('users/{id}', [UserController::class, 'getUsers'])->name('user.show');
    Route::put('update_user', [UserController::class, 'updateUser'])->name('update_user');
    Route::delete('delete_user', [UserController::class, 'deleteUser'])->name('delete_user');

    Route::get('projects', [ProjectController::class, 'getProjects'])->name('projects');
    Route::get('projects/{id}', [ProjectController::class, 'getProjects'])->name('project');
    Route::post('create_project', [ProjectController::class, 'createProject'])->name('create_Project');
    Route::put('update_project/{id}', [ProjectController::class, 'updateProject'])->name('update_Project');
    Route::delete('delete_project/{id}', [ProjectController::class, 'deleteProject'])->name('delete_Project');

    Route::get('tasks', [TaskController::class, 'getTasks'])->name('tasks');
    Route::post('create_task', [TaskController::class, 'createTask'])->name('create_Task');
    Route::put('update_task/{id}', [TaskController::class, 'updateTask'])->name('update_Task');
    Route::delete('delete_task/{id}', [TaskController::class, 'deleteTask'])->name('delete_Task');

    Route::get('tags', [TagController::class, 'getTags'])->name('tags');
    Route::post('create_tag', [TagController::class, 'createTag'])->name('create_tag');
    Route::put('update_tag/{id}', [TagController::class, 'updateTag'])->name('update_tag');
    Route::delete('delete_tag/{id}', [TagController::class, 'deleteTag'])->name('delete_tag');

    Route::get('notifications', [NotificationController::class, 'getNotifications'])->name('notifications');
    Route::post('create_notification', [NotificationController::class, 'createNotification'])->name('create_notification');
    Route::put('update_notification/{id}', [NotificationController::class, 'updateNotification'])->name('update_notification');
    Route::delete('delete_notification/{id}', [NotificationController::class, 'deleteNotification'])->name('delete_notification');

    Route::get('admin/users', [AdminController::class, 'getAdmins'])->name('admins');
    Route::put('admin/users/{id}/role', [AdminController::class, 'updateUserRole'])->name('update_user_role');
    Route::delete('admin/users/{id}', [AdminController::class, 'deleteUser'])->name('admin_delete_user');
});

Route::get('filter_content', [NotificationController::class, 'getFilteredContent'])->name('filter_content');
