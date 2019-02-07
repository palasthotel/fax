<?php
namespace App\GraphQL\Query;

use App\Repositories\UserRepository;
use App\Role;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;

class FreelancersCountQuery extends Query
{
    protected $attributes = ['name' => 'freelancersCount'];

    public function type()
    {
        return Type::int();
    }

    public function args()
    {
        return [
            'ids' => ['name' => 'ids', 'type' => Type::listOf(Type::int())],
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
        $roles = [Role::$ROLE_FREELANCER];
        $expertises = (!empty($args['expertises']))
            ? $args['expertises']
            : false;
        $locations = (!empty($args['locations'])) ? $args['locations'] : false;

        return UserRepository::get_count($ids, $roles, $expertises, $locations);
    }
}
