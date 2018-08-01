<?php
namespace App\GraphQL\Query;

use App\Repositories\UserRepository;
use App\Role;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class FreelancersQuery extends Query
{
    protected $attributes = ['name' => 'freelancers'];

    public function type()
    {
        return Type::listOf(GraphQL::type('User'));
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
            ],
            'limit' => ['name' => 'limit', 'type' => Type::int()],
            'offset' => ['name' => 'offset', 'type' => Type::int()],
            'order' => ['order' => 'offset', 'type' => Type::string()]
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
        $limit = (!empty($args['limit'])) ? $args['limit'] : 10;
        $offset = (!empty($args['offset'])) ? $args['offset'] : 0;
        $order = (!empty($args['order'])) ? $args['order'] : false;

        return UserRepository::get(
            $ids,
            $roles,
            $expertises,
            $locations,
            $order,
            $limit,
            $offset
        );
    }
}
