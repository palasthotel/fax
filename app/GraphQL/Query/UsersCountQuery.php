<?php
namespace App\GraphQL\Query;

use App\Repositories\UserRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;

class UsersCountQuery extends Query
{
    protected $attributes = ['name' => 'usersCount'];

    public function type()
    {
        return Type::int();
    }

    public function args()
    {
        return [
            'ids' => ['name' => 'ids', 'type' => Type::listOf(Type::int())],
            'roles' => [
                'name' => 'roles',
                'type' => Type::listOf(Type::string())
            ],
            'expertises' => [
                'name' => 'expertises',
                'type' => Type::listOf(Type::int())
            ],
            'locations' => [
                'name' => 'locations',
                'type' => Type::listOf(Type::int())
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $ids = (!empty($args['ids'])) ? $args['ids'] : false;
        $roles = (!empty($args['roles'])) ? $args['roles'] : false;
        $expertises = (!empty($args['expertises']))
            ? $args['expertises']
            : false;
        $locations = (!empty($args['locations'])) ? $args['locations'] : false;

        return UserRepository::get_count($ids, $roles, $expertises, $locations);
    }
}
