<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL;
use GraphQL\Type\Definition\Type;

class MessageType extends GraphQLType
{
    protected $attributes = ['name' => 'Message', 'description' => 'A message'];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the pitch'
            ],
            'pitch' => [
                'type' => Type::nonNull(GraphQL::type('Pitch')),
                'description' => 'The pitch the message is attached to'
            ],
            'user' => [
                'type' => Type::nonNull(GraphQL::type('User')),
                'description' => 'The user who created the message'
            ],
            'text' => [
                'type' => Type::string(),
                'description' => 'The text of the message'
            ],
            'created' => [
                'type' => Type::nonNull(Type::string()),
                'description' => 'The date the message was created'
            ],
            'age' => [
                'type' => Type::string(),
                'description' =>
                    'The date the article was created as human readable'
            ]
        ];
    }

    protected function resolvePitchField($root, $args)
    {
        return $root->pitch()->first();
    }

    protected function resolveUserField($root, $args)
    {
        return $root->user()->first();
    }

    protected function resolveCreatedField($root, $args)
    {
        return $root->attributesToArray()['created_at'];
    }
}
