<?php
namespace App\Repositories;

use App\Role;
use Auth;
use App\Message;

class MessageRepository
{
    /**
     * Get articles by id
     *
     * @param $messageId
     *
     * @return mixed
     */
    static function getById($messageId)
    {
        $query = Message::where('id', $messageId);
        $query = MessageRepository::addRoleCheckToQuery($query);

        return $query->first();
    }

    /**
     * Get articles by id
     *
     * @param $ids
     *
     * @return mixed
     */
    static function getByPitchId($pitchId)
    {
        $query = Message::where('pitch_id', $pitchId);
        $query = MessageRepository::addRoleCheckToQuery($query);
        $query = $query->orderBy('created_at', 'asc');

        return $query->get();
    }

    /**
     * Add query parameters that make sure the user sees only the pitches he is allowed.
     *
     * @param $query
     *
     * @return mixed
     */
    static function addRoleCheckToQuery($query)
    {
        $user = Auth::guard('api')->user();

        if (!$user->hasRole(Role::$ROLE_EDITOR)) {
            $query = $query->whereHas('pitch', function ($query) use ($user) {
                $query
                    ->where('user_id', $user->id)
                    ->orWhere('assignee_id', $user->id);
            });
        }

        return $query;
    }
}
