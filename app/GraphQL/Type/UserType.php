<?php
namespace App\GraphQL\Type;

use Folklore\GraphQL\Support\Type as GraphQLType;
use GraphQL;
use GraphQL\Type\Definition\Type;

class UserType extends GraphQLType
{
    protected $attributes = ['name' => 'User', 'description' => 'A user'];

    public function fields()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user'
            ],
            'firstName' => [
                'type' => Type::string(),
                'description' => 'The first name of user'
            ],
            'lastName' => [
                'type' => Type::string(),
                'description' => 'The last name of user'
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'The email of user'
            ],
            'profileImage' => [
                'type' => GraphQL::type('Image'),
                'description' => 'The users profile image'
            ],
            'roles' => [
                'type' => Type::listOf(Type::string()),
                'description' => 'The roles of the user'
            ],
            'phone' => [
                'type' => Type::string(),
                'description' => 'The phone of user'
            ],
            'website' => [
                'type' => Type::string(),
                'description' => 'The website of user'
            ],
            'facebook' => [
                'type' => Type::string(),
                'description' => 'The facebook of user'
            ],
            'twitter' => [
                'type' => Type::string(),
                'description' => 'The twitter of user'
            ],
            'instagram' => [
                'type' => Type::string(),
                'description' => 'The instagram of user'
            ],
            'pitches' => [
                'type' => Type::listOf(GraphQL::type('Pitch')),
                'description' => 'The pitches of the user'
            ],
            'locations' => [
                'type' => Type::listOf(GraphQL::type('Location')),
                'description' => 'The locations of the user'
            ],
            'expertises' => [
                'type' => Type::listOf(GraphQL::type('Expertise')),
                'description' => 'The expertises of the user'
            ],
            'expertise' => [
                'type' => Type::string(),
                'description' => 'Custom expertise entries'
            ]
        ];
    }

    protected function resolveLastNameField($root, $args)
    {
        return $root->last_name;
    }

    protected function resolveFirstNameField($root, $args)
    {
        return $root->first_name;
    }

    protected function resolveRolesField($root, $args)
    {
        return $root->getRoles();
    }

    protected function resolvePitchesField($root, $args)
    {
        return $root->pitches()->get();
    }

    protected function resolveLocationsField($root, $args)
    {
        return $root->locations()->get();
    }

    protected function resolveExpertisesField($root, $args)
    {
        return $root->expertises()->get();
    }
}
