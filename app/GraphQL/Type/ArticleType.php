<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL;
use GraphQL\Type\Definition\Type;

class ArticleType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Article',
        'description' => 'An article'
    ];

    public function fields()
    {
        $fields = [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the pitch'
            ],
            'pitch' => [
                'type' => Type::nonNull(GraphQL::type('Pitch')),
                'description' => 'The pitch the article is attached to'
            ],
            'title' => [
                'type' => Type::string(),
                'description' => 'The title of the article'
            ],
            'text' => [
                'type' => Type::string(),
                'description' => 'The text of the article'
            ],
            'lead' => [
                'type' => Type::string(),
                'description' => 'The lead text of the article'
            ],
            'note' => [
                'type' => Type::string(),
                'description' => 'Note to the article'
            ],
            'rating' => [
                'type' => Type::int(),
                'description' => 'The rating of the article (1-5)'
            ],
            'images' => [
                'type' => Type::listOf(GraphQL::type('Image')),
                'description' => "The articles images"
            ],
            'created' => [
                'type' => Type::string(),
                'description' => 'The date the article was created'
            ],
            'age' => [
                'type' => Type::string(),
                'description' =>
                    'The date the article was created as human readable'
            ],
            'updated' => [
                'type' => Type::string(),
                'description' => 'The date the article was updated'
            ]
        ];

        return $fields;
    }

    protected function resolvePitchField($root, $args)
    {
        return $root->pitch()->first();
    }

    protected function resolveCreatedField($root, $args)
    {
        return $root->attributesToArray()['created_at'];
    }

    protected function resolveUpdatedField($root, $args)
    {
        return $root->attributesToArray()['updated_at'];
    }

    protected function resolveImagesField($root, $args)
    {
        return $root->images()->get();
    }
}
