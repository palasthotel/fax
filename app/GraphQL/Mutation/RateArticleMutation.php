<?php
namespace App\GraphQL\Mutation;

use App\Repositories\ArticleRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\DB;

class RateArticleMutation extends Mutation
{
    protected $attributes = ['name' => 'rateArticle'];

    public function type()
    {
        return GraphQL::type('Article');
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int(),
                'rules' => [
                    'int',
                    'required',
                    'exists:articles,id',
                    function ($attribute, $value, $fail) {
                        $user = Auth::guard('api')->user();

                        if (!$user->isEditor()) {
                            return $fail('Only editors can vote an article.');
                        }

                        $article = \App\Article::find($value);
                        if (!$article) {
                            return $fail(
                                'There is no article with the id ' . $attribute
                            );
                        }
                    }
                ]
            ],
            'rating' => [
                'name' => 'rating',
                'type' => Type::int(),
                'rules' => ['integer', 'required', 'max:5', 'min:1']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = intval($args['id']);
        $rating = intval($args['rating']);

        $article = ArticleRepository::getById($id);
        $article->rating = $rating;
        $article->save();

        return $article;
    }
}
