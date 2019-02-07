<?php
namespace App\Repositories;

use App\Role;
use App\Pitch;
use Auth;

class PitchRepository
{
    static $ORDER_CREATED_DESC = 'pitches.created.desc';
    static $ORDER_CREATED_ASC = 'pitches.created.asc';

    /**
     * Get pitch by id
     *
     * @param $pitchId
     *
     * @return mixed
     */
    static function getById($pitchId)
    {
        $query = Pitch::where('id', $pitchId);
        $query = PitchRepository::addRoleCheckToQuery($query);

        return $query->first();
    }

    static function get(
        $ids = false,
        $user_id = false,
        $assignee_id = false,
        $state = false,
        $order = false,
        $limit = 10,
        $offset = 0
    ) {
        $query = PitchRepository::get_query(
            $ids,
            $user_id,
            $assignee_id,
            $state,
            $order
        );

        return $query
            ->skip($offset)
            ->take($limit)
            ->get();
    }

    static function get_count(
        $ids = false,
        $user_id = false,
        $assignee_id = false,
        $state = false
    ) {
        $query = PitchRepository::get_query(
            $ids,
            $user_id,
            $assignee_id,
            $state
        );

        return $query->count();
    }

    static function get_query(
        $ids = false,
        $user_id = false,
        $assignee_id = false,
        $state = false,
        $order = false
    ) {
        switch ($order) {
            case static::$ORDER_CREATED_ASC:
                $query = Pitch::orderBy('created_at', 'asc');
                break;
            default:
                $query = Pitch::orderBy('created_at', 'desc');
        }

        $query = PitchRepository::addRoleCheckToQuery($query);

        if (!empty($ids)) {
            $query = $query->whereIn('id', $ids);
        }

        if (!empty($user_id)) {
            $query = $query->where('user_id', $user_id);
        }

        if (!empty($assignee_id)) {
            $query = $query->where('assignee_id', $assignee_id);
        }

        if (!empty($state)) {
            $query = $query->where('state', $state);
        }

        return $query;
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
            $query = $query->where(function ($query) use ($user) {
                $query
                    ->where('user_id', $user->id)
                    ->orWhere('assignee_id', $user->id);
            });
        }

        return $query;
    }
}
