<?php
namespace App\GraphQL\Type;

use App\Article;
use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL;
use GraphQL\Type\Definition\Type;

class PitchType extends GraphQLType
{
    protected $attributes = ['name' => 'Pitch', 'description' => 'A pitch'];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the pitch'
            ],
            'user' => [
                'type' => Type::nonNull(GraphQL::type('User')),
                'description' => 'The user who created the pitch'
            ],
            'assignee' => [
                'type' => GraphQL::type('User'),
                'description' =>
                    'The id of the user who is assigned to the pitch'
            ],
            'title' => [
                'type' => Type::string(),
                'description' => 'The title of the pitch'
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of the pitch'
            ],
            'deadline' => [
                'type' => Type::string(),
                'description' => 'The date of the deadline of the pitch'
            ],
            'state' => [
                'type' => Type::string(),
                'description' => 'The state of the pitch'
            ],
            'article' => [
                'type' => GraphQL::type('Article'),
                'description' => 'The article attached to the pitch'
            ],
            'created' => [
                'type' => Type::string(),
                'description' => 'The date the pitch was created'
            ],
            'updated' => [
                'type' => Type::string(),
                'description' => 'The date the pitch was updated'
            ],
            'age' => [
                'type' => Type::string(),
                'description' =>
                    'The date the article was created as human readable'
            ]
        ];
    }

    protected function resolveUserField($root, $args)
    {
        return $root->user()->first();
    }

    protected function resolveAssigneeField($root, $args)
    {
        return $root->assignee()->first();
    }

    protected function resolveArticleField($root, $args)
    {
        return Article::where('pitch_id', $root->id)->first();
    }

    protected function resolveCreatedField($root, $args)
    {
        return $root->attributesToArray()['created_at'];
    }

    protected function resolveUpdatedField($root, $args)
    {
        return $root->attributesToArray()['updated_at'];
    }
}
