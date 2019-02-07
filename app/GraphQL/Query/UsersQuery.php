<?php
namespace App\GraphQL\Query;

use App\Repositories\UserRepository;
use Folklore\GraphQL\Support\Query;
use Folklore\GraphQL\Support\Traits\ShouldValidate;
use GraphQL;
use GraphQL\Type\Definition\Type;
use GraphQL\Error\Error;
use Illuminate\Validation\Rule;

class UsersQuery extends Query
{
    use ShouldValidate;

    protected $attributes = ['name' => 'users'];

    public function type()
    {
        return Type::listOf(GraphQL::type('User'));
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
            ],
            'limit' => ['name' => 'limit', 'type' => Type::int()],
            'offset' => ['name' => 'offset', 'type' => Type::int()],
            'order' => [
                'order' => 'offset',
                'type' => Type::string(),
                "rules" => [
                    'string',
                    Rule::in([
                        UserRepository::$ORDER_CREATED_DESC,
                        UserRepository::$ORDER_CREATED_ASC,
                        UserRepository::$ORDER_FIRSTNAME_ASC,
                        UserRepository::$ORDER_FIRSTNAME_DESC,
                        UserRepository::$ORDER_LASTNAME_ASC,
                        UserRepository::$ORDER_LASTNAME_DESC
                    ])
                ]
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
