<?php
namespace App\GraphQL\Query;

use App\Repositories\LocationRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class LocationQuery extends Query
{
    protected $attributes = ['name' => 'location'];

    public function type()
    {
        return GraphQL::type('Location');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return LocationRepository::getById($args['id']);
        }

        return null;
    }
}
