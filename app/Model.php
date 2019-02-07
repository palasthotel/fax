<?php
namespace App;

use Carbon\Carbon;

/**
 * Extends the base model with computed values and
 * timezone informations inside the created_at and
 * updated_at fields.
 */
class Model extends \Illuminate\Database\Eloquent\Model
{
    /**
     * List of computed values
     * @var array
     */
    protected $appends = ['age'];

    /**
     * Returns informations about the timespan when an article was created
     * @return string
     */
    public function getAgeAttribute()
    {
        $created = new Carbon($this->created_at);
        return $created->diffForHumans();
    }

    public function getCreatedAtAttribute($date)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('c');
    }

    public function getUpdatedAtAttribute($date)
    {
        return Carbon::createFromFormat('Y-m-d H:i:s', $date)->format('c');
    }
}
