<?php
namespace App\GraphQL\Query;

use App\Repositories\PitchRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class PitchesQuery extends Query
{
    protected $attributes = ['name' => 'pitches'];

    public function type()
    {
        return Type::listOf(GraphQL::type('Pitch'));
    }

    public function args()
    {
        return [
            'ids' => ['name' => 'ids', 'type' => Type::listOf(Type::int())],
            'user_id' => ['name' => 'userId', 'type' => Type::int()],
            'assignee_id' => ['name' => 'assigneeId', 'type' => Type::int()],
            'state' => ['name' => 'state', 'type' => Type::string()],
            'limit' => ['name' => 'limit', 'type' => Type::int()],
            'offset' => ['name' => 'offset', 'type' => Type::int()],
            'order' => ['order' => 'offset', 'type' => Type::string()]
        ];
    }

    public function resolve($root, $args)
    {
        $ids = (!empty($args['ids'])) ? $args['ids'] : false;
        $user_id = (!empty($args['userId'])) ? $args['userId'] : false;
        $assignee_id = (!empty($args['assigneeId']))
            ? $args['assigneeId']
            : false;
        $state = (!empty($args['state'])) ? $args['state'] : false;
        $limit = (!empty($args['limit'])) ? $args['limit'] : 10;
        $offset = (!empty($args['offset'])) ? $args['offset'] : 0;
        $order = (!empty($args['order'])) ? $args['order'] : false;

        return PitchRepository::get(
            $ids,
            $user_id,
            $assignee_id,
            $state,
            $order,
            $limit,
            $offset
        );
    }
}
