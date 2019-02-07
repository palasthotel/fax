<?php
namespace App\GraphQL\Query;

use App\Repositories\ArticleRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class ArticleQuery extends Query
{
    protected $attributes = ['name' => 'articles'];

    public function type()
    {
        return GraphQL::type('Article');
    }

    public function args()
    {
        return ['id' => ['name' => 'id', 'type' => Type::int()]];
    }

    public function resolve($root, $args)
    {
        if (isset($args['id'])) {
            return ArticleRepository::getById($args['id']);
        }

        return null;
    }
}
