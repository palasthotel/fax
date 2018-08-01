<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public static $ROLE_EDITOR = 'EDITOR';
    public static $ROLE_FREELANCER = 'FREELANCER';

    public function users()
    {
        return $this->belongsToMany(User::class);
    }
}
