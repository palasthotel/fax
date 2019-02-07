<?php
namespace App\Repositories;

use App\Role;
use Auth;
use App\Expertise;

class ExpertiseRepository
{
    /**
     * Get expertises by id
     *
     * @param $expertiseId
     *
     * @return mixed
     */
    static function getById($expertiseId)
    {
        $query = Expertise::where('id', $expertiseId);

        return $query->first();
    }

    /**
     * Get expertises by id
     *
     * @param $ids
     *
     * @return mixed
     */
    static function getByIds($ids)
    {
        $query = Expertise::whereIn('id', $ids);
        $query = $query->orderBy('title', 'desc');

        return $query->get();
    }

    /**
     * Get all expertises you are allowed to see
     *
     * @return mixed
     */
    static function getAll()
    {
        $query = Expertise::orderBy('created_at', 'asc');

        return $query->get();
    }
}
