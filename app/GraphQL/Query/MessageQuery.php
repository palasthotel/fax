<?php
namespace App\GraphQL\Query;

use App\Repositories\MessageRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class MessageQuery extends Query
{
    protected $attributes = ['name' => 'messages'];

    public function type()
    {
        return GraphQL::type('Message');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return MessageRepository::getById($args['id']);
        }

        return null;
    }
}
