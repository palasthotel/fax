<?php
namespace App\GraphQL\Query;

use App\Repositories\MessageRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class MessagesQuery extends Query
{
    protected $attributes = ['name' => 'messages'];

    public function type()
    {
        return Type::listOf(GraphQL::type('Message'));
    }

    public function args()
    {
        return ['pitch_id' => ['name' => 'pitchId', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['pitchId'])) {
            return MessageRepository::getByPitchId($args['pitchId']);
        }

        return null;
    }
}
