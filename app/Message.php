<?php
namespace App;

use App\Model;
use App\Pitch;
use App\User;

class Message extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['text'];

    /**
     * Get the pitch
     */
    public function pitch()
    {
        return $this->belongsTo(Pitch::class);
    }

    /**
     * Get the pitch
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
