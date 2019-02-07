<?php
namespace App;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['url', 'text', 'path'];

    /**
     * Get the user that owns the pitch.
     */
    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class);
    }

    public function getUrlAttribute($value)
    {
        if ($this->storage != 'public') {
            throw new \Exception(
                "This image is not public, so it doesnt has an url [{$this->path}]"
            );
        }

        return asset($value);
    }
}
