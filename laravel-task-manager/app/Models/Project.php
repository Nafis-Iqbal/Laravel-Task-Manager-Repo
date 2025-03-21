<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
    ];

    protected $hidden = [];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function user()
    {
        return $this->BelongsTo(User::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    #Scope Events

    #Accesors & Mutators

    #Events & Observers
}
