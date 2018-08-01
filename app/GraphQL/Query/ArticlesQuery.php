<?php
namespace App\GraphQL\Query;

use App\Repositories\ArticleRepository;
use Folklore\GraphQL\Support\Query;
use GraphQL;
use GraphQL\Type\Definition\Type;

class ArticlesQuery extends Query
{
    protected $attributes = ['name' => 'articles'];

    public function type()
    {
        return Type::listOf(GraphQL::type('Article'));
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
            return ArticleRepository::getByIds($args['ids']);
        } else {
            return ArticleRepository::getAll();
        }
    }
}
