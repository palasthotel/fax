<?php
namespace App;

use Auth;
use App\Model;
use App\MailHandler;

class Pitch extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['title', 'description'];

    static $STATE_NEW = 'new';
    static $STATE_REJECTED = 'rejected';
    static $STATE_WORK_IN_PROGRESS = 'work in progress';
    static $STATE_APPROVAL = 'approval';
    static $STATE_CANCELED = 'canceled';
    static $STATE_PUBLISHED = 'published';

    static $ERROR_STATECHANGE_NOT_POSSIBLE = 1;
    static $ERROR_STATECHANGE_NOT_ALLOWED = 2;
    static $ERROR_STATECHANGE_FINAL_STATE = 3;

    /**
     * Get the user that owns the pitch.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the user that is assigned to the pitch.
     */
    public function assignee()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the article that is assigned to the pitch.
     */
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    /**
     * Change the state of this pitch
     * @param string $newState
     */
    public function updateState($newState)
    {
        $states = config('app.fax.pitch_states');

        if (!isset($states[$this->state])) {
            return self::$ERROR_STATECHANGE_FINAL_STATE;
        }

        // check if the state changed is allowed
        $possible = $states[$this->state];
        if (!array_key_exists($newState, $possible)) {
            return self::$ERROR_STATECHANGE_NOT_POSSIBLE;
        }

        // check if the user is allowed to change the state
        $user = Auth::guard('api')->user();
        $allowed = false;
        foreach ($user->roles as $role) {
            if (in_array($role->name, $possible[$newState])) {
                $allowed = true;
            }
        }
        if (!$allowed) {
            return self::$ERROR_STATECHANGE_NOT_ALLOWED;
        }

        $this->state = $newState;
        return true;
    }
}
