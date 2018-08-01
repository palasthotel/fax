<?php
namespace App\GraphQL\Query;

use App\Repositories\PitchRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL\Type\Definition\Type;

class PitchesCountQuery extends Query
{
    protected $attributes = ['name' => 'pitchesCount'];

    public function type()
    {
        return Type::int();
    }

    public function args()
    {
        return [
            'ids' => ['name' => 'ids', 'type' => Type::listOf(Type::int())],
            'user_id' => ['name' => 'userId', 'type' => Type::int()],
            'assignee_id' => ['name' => 'assigneeId', 'type' => Type::int()],
            'state' => ['name' => 'state', 'type' => Type::string()]
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

        return PitchRepository::get_count($ids, $user_id, $assignee_id, $state);
    }
}
