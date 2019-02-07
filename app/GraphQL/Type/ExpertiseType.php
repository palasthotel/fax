<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL\Type\Definition\Type;

class ExpertiseType extends GraphQLType
{
    protected $attributes = [
        'name' => 'Expertise',
        'description' => 'An expertise'
    ];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the expertise'
            ],
            'name' => [
                'type' => Type::string(),
                'description' => 'The first name of expertise'
            ],
            'description' => [
                'type' => Type::string(),
                'description' => 'The description of expertise'
            ]
        ];
    }
}
