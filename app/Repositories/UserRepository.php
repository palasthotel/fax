<?php
namespace App\Repositories;

use App\Role;
use App\User;
use Auth;

class UserRepository
{
    static $ORDER_CREATED_DESC = 'users.created.desc';
    static $ORDER_CREATED_ASC = 'users.created.asc';
    static $ORDER_FIRSTNAME_DESC = 'users.firstName.desc';
    static $ORDER_FIRSTNAME_ASC = 'users.firstName.asc';
    static $ORDER_LASTNAME_DESC = 'users.lastName.desc';
    static $ORDER_LASTNAME_ASC = 'users.lastName.asc';

    /**
     * Get user by id
     *
     * @param $userId
     *
     * @return mixed
     */
    static function getById($userId)
    {
        $query = User::where('id', $userId);
        $query = UserRepository::addRoleCheckToQuery($query);

        return $query->first();
    }

    /**
     * Get all users you are allowed to see
     *
     * @param bool $ids
     * @param bool $roles
     * @param bool $expertises
     * @param bool $locations
     * @param int $limit
     * @param int $offset
     *
     * @return mixed
     */
    static function get(
        $ids = false,
        $roles = false,
        $expertises = false,
        $locations = false,
        $order = false,
        $limit = 10,
        $offset = 0
    ) {
        $query = UserRepository::getQuery(
            $ids,
            $roles,
            $expertises,
            $locations,
            $order
        );

        return $query
            ->skip($offset)
            ->take($limit)
            ->get();
    }

    /**
     * Get count of users
     *
     * @param bool $ids
     * @param bool $roles
     * @param bool $expertises
     * @param bool $locations
     *
     * @return mixed
     */
    static function get_count(
        $ids = false,
        $roles = false,
        $expertises = false,
        $locations = false
    ) {
        $query = UserRepository::getQuery(
            $ids,
            $roles,
            $expertises,
            $locations
        );

        return $query->count();
    }

    /**
     * Get query for all users
     *
     * @param bool $ids
     * @param bool $roles
     * @param bool $expertises
     * @param bool $locations
     *
     * @return mixed
     */
    static function getQuery(
        $ids = false,
        $roles = false,
        $expertises = false,
        $locations = false,
        $order = false
    ) {
        switch ($order) {
            case static::$ORDER_FIRSTNAME_ASC:
                $query = User::orderBy('first_name', 'asc');
                break;
            case static::$ORDER_FIRSTNAME_DESC:
                $query = User::orderBy('first_name', 'desc');
                break;
            case static::$ORDER_LASTNAME_ASC:
                $query = User::orderBy('last_name', 'asc');
                break;
            case static::$ORDER_LASTNAME_DESC:
                $query = User::orderBy('last_name', 'desc');
                break;
            case static::$ORDER_CREATED_ASC:
                $query = User::orderBy('created_at', 'asc');
                break;
            default:
                $query = User::orderBy('created_at', 'desc');
        }
        $query = UserRepository::addRoleCheckToQuery($query);

        if (!empty($ids)) {
            $query = $query->whereIn('id', $ids);
        }

        if (!empty($roles)) {
            $query = $query->whereHas('roles', function ($query) use ($roles) {
                $query->whereIn('name', $roles);
            });
        }

        if (!empty($expertises)) {
            $query = $query->whereHas('expertises', function ($query) use (
                $expertises
            ) {
                $query->whereIn('expertises.id', $expertises);
            });
        }

        if (!empty($locations)) {
            $query = $query->whereHas('locations', function ($query) use (
                $locations
            ) {
                $query->whereIn('locations.id', $locations);
            });
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
            //non editors can see themselves and editors
            $query = $query->where(function ($query) use ($user) {
                $query
                    ->where('id', $user->id)
                    ->orWhere(function ($query) use ($user) {
                        $query->whereHas('roles', function ($query) {
                            $query->where('name', Role::$ROLE_EDITOR);
                        });
                    });
            });
        }

        return $query;
    }
}
