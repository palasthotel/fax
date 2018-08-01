<?php
namespace App\GraphQL\Mutation;

use App\Repositories\ArticleRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\DB;

class UpdateArticleMutation extends Mutation
{
    protected $attributes = ['name' => 'updateArticle'];

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
                        $count = DB::table('articles')
                            ->join(
                                'pitches',
                                'articles.pitch_id',
                                '=',
                                'pitches.id'
                            )
                            ->where('articles.id', $value)
                            ->where('pitches.user_id', $user->id)
                            ->count();
                        if ($count < 1) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ],
            'title' => [
                'name' => 'title',
                'type' => Type::string(),
                'rules' => ['string', 'required', 'min:1']
            ],
            'text' => [
                'name' => 'text',
                'type' => Type::string(),
                'rules' => ['string']
            ],
            'lead' => [
                'name' => 'lead',
                'type' => Type::string(),
                'rules' => ['string']
            ],
            'note' => [
                'name' => 'note',
                'type' => Type::string(),
                'rules' => ['string']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = intval($args['id']);
        $title = strip_tags($args['title']);
        $text = strip_tags($args['text']);
        $lead = strip_tags($args['lead']);
        $note = strip_tags($args['note']);

        $article = ArticleRepository::getById($id);
        $article->title = $title;
        $article->text = $text;
        $article->lead = $lead;
        $article->note = $note;
        $article->save();

        return $article;
    }
}
