<?php
namespace App\GraphQL\Query;

use App\Repositories\UserRepository;
use Auth;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class UserQuery extends Query
{
    protected $attributes = ['name' => 'users'];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return UserRepository::getById($args['id']);
        }

        return Auth::guard('api')->user();
    }
}
