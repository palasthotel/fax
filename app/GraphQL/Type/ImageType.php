<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\Config;

class ImageType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Image',
        'description' => 'An image object'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the image'
            ],
            'url' => [
                'type' => Type::string(),
                'description' => 'The url of the image'
            ],
            'path' => [
                'type' => Type::string(),
                'description' => 'The path of the image'
            ],
            'text' => [
                'type' => Type::string(),
                'description' => 'The description text of the image'
            ],
            'storage' => [
                'type' => Type::string(),
                'description' => 'The storage where the image is stored'
            ]
        ];
    }

    protected function resolveTextField($root, $args)
    {
        return $root->text;
    }
}
