<?php
namespace App;

use App\Model;
use App\Pitch;
use Auth;

class Article extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'text', 'lead', 'note'];

    /**
     * List of computed values
     * @var array
     */
    protected $appends = ['age'];

    /**
     * Get the user that owns the pitch.
     */
    public function pitch()
    {
        return $this->belongsTo(Pitch::class);
    }

    public function images()
    {
        return $this->belongsToMany(Image::class);
    }

    public function getRatingAttribute($value)
    {
        $user = Auth::guard('api')->user();

        // only editors are allowe to see the rating, other users will get a null result
        if ($user && !$user->isEditor()) {
            return null;
        }

        if ($value == 0) {
            return null;
        }

        return $value;
    }
}
