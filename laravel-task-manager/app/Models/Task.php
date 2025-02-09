<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    // Define the table name if it's different from the default (tasks)
    protected $table = 'tasks';

    // Define which attributes are mass assignable
    protected $fillable = [
        'title',
        'description',
        'priority',
        'status',
        'project_id',
        'user_id', // Foreign key for the user who owns the task
    ];

    protected $hidden = [];

    protected $casts = [];

    // Define the relationship between Task and User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function tags()
    {
        return $this->hasMany(Tag::class);
    }

    #Scope Events

    #Accesors & Mutators

    #Events & Observers
}
