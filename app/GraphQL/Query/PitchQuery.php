<?php
namespace App\GraphQL\Query;

use App\Repositories\PitchRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class PitchQuery extends Query
{
    protected $attributes = ['name' => 'pitch'];

    public function type()
    {
        return GraphQL::type('Pitch');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return PitchRepository::getById($args['id']);
        }

        return null;
    }
}
