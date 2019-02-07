<?php
namespace App\GraphQL\Query;

use App\Repositories\LocationRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class LocationsQuery extends Query
{
    protected $attributes = ['name' => 'locations'];

    public function type()
    {
        return Type::listOf(GraphQL::type('Location'));
    }

    public function args()
    {
        return [
            'ids' => ['name' => 'ids', 'type' => Type::listOf(Type::int())]
        ];
    }

    public function resolve($root, $args)
    {
        if (isset($args['ids'])) {
            return LocationRepository::getByIds($args['ids']);
        } else {
            return LocationRepository::getAll();
        }
    }
}
