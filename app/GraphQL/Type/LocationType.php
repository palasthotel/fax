<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL\Type\Definition\Type;

class LocationType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Location',
        'description' => 'A location'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the location'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The name of the location'
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of the location'
            ]
        ];
    }
}
