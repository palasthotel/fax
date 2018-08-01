<?php
namespace App\Repositories;

use App\Role;
use Auth;
use App\Article;

class ArticleRepository
{
    /**
     * Get articles by id
     *
     * @param $articleId
     *
     * @return mixed
     */
    static function getById($articleId)
    {
        $query = Article::where('id', $articleId);
        $query = ArticleRepository::addRoleCheckToQuery($query);

        return $query->first();
    }

    /**
     * Get articles by id
     *
     * @param $ids
     *
     * @return mixed
     */
    static function getByIds($ids)
    {
        $query = Article::whereIn('id', $ids);
        $query = ArticleRepository::addRoleCheckToQuery($query);
        $query = $query->orderBy('created_at', 'desc');

        return $query->get();
    }

    /**
     * Get all articles you are allowed to see
     *
     * @return mixed
     */
    static function getAll()
    {
        $query = Article::orderBy('created_at', 'asc');
        $query = ArticleRepository::addRoleCheckToQuery($query);

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
