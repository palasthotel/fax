<?php
namespace App\Repositories;

use Auth;
use App\Location;

class LocationRepository
{
    /**
     * Get locations by id
     *
     * @param $expertiseId
     *
     * @return mixed
     */
    static function getById($expertiseId)
    {
        $query = Location::where('id', $expertiseId);

        return $query->first();
    }

    /**
     * Get locations by id
     *
     * @param $ids
     *
     * @return mixed
     */
    static function getByIds($ids)
    {
        $query = Location::whereIn('id', $ids);
        $query = $query->orderBy('title', 'desc');

        return $query->get();
    }

    /**
     * Get all locations you are allowed to see
     *
     * @return mixed
     */
    static function getAll()
    {
        $query = Location::orderBy('created_at', 'asc');

        return $query->get();
    }
}
