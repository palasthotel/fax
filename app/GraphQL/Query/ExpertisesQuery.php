<?php
namespace App\GraphQL\Query;

use App\Repositories\ExpertiseRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class ExpertisesQuery extends Query
{
    protected $attributes = ['name' => 'expertises'];

    public function type()
    {
        return Type::listOf(GraphQL::type('Expertise'));
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
            return ExpertiseRepository::getByIds($args['ids']);
        } else {
            return ExpertiseRepository::getAll();
        }
    }
}
