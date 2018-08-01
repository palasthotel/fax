<?php
namespace App\GraphQL\Query;

use App\Repositories\ExpertiseRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class ExpertiseQuery extends Query
{
    protected $attributes = ['name' => 'expertise'];

    public function type()
    {
        return GraphQL::type('Expertise');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return ExpertiseRepository::getById($args['id']);
        }

        return null;
    }
}
