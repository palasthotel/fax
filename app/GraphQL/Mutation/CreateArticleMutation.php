<?php
namespace App\GraphQL\Mutation;

use App\Article;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Validation\Rule;

class CreateArticleMutation extends Mutation
{
    protected $attributes = ['name' => 'createArticle'];

    public function type()
    {
        return GraphQL::type('Article');
    }

    public function args()
    {
        return [
            'pitchId' => [
                'name' => 'pitchId',
                'type' => Type::int(),
                'rules' => [
                    'int',
                    'required',
                    'unique:articles,pitch_id',
                    Rule::exists('pitches', 'id')->where(function ($query) {
                        $user = Auth::guard('api')->user();
                        $query->where('user_id', $user->id);
                    })
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
        $pitch_id = intval($args['pitchId']);
        $title = strip_tags($args['title']);
        $text = strip_tags($args['text']);
        $lead = (!empty($args['lead'])) ? strip_tags($args['lead']) : "";
        $note = (!empty($args['lead'])) ? strip_tags($args['note']) : "";

        $article = new Article();
        $article->pitch_id = $pitch_id;
        $article->title = $title;
        $article->text = $text;
        $article->lead = $lead;
        $article->note = $note;
        $article->save();

        return $article;
    }
}
