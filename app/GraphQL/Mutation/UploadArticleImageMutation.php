<?php
namespace App\GraphQL\Mutation;

use App\Article;
use App\Repositories\UserRepository;
use App\Image;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Type\Scalar\UploadType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class UploadArticleImageMutation extends Mutation
{
    protected $attributes = ['name' => 'uploadArticleImage'];

    public function type()
    {
        return GraphQL::type('Image');
    }

    public function args()
    {
        return [
            'file' => [
                'type' => UploadType::getInstance(),
                'description' => 'An image',
                'rules' => ['required', 'image']
            ],
            'text' => [
                'name' => 'text',
                'type' => Type::string(),
                'rules' => ['string']
            ],
            'articleId' => [
                'type' => Type::int(),
                'description' => 'Id of the article to add the image to',
                'rules' => [
                    'required',
                    'int',
                    'exists:articles,id',
                    function ($attribute, $value, $fail) {
                        $user = Auth::guard('api')->user();
                        $article = Article::find($value);
                        if (isset($article)) {
                            $pitch = $article->pitch()->first();
                            if ($pitch->user_id !== $user->id) {
                                return $fail(
                                    'You are not allowed to add an image to this article.'
                                );
                            }
                        }
                    }
                ]
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $article_id = $args['articleId'];
        $article = Article::find($article_id);
        $user = Auth::guard('api')->user();

        $folder = '/img/article/' . $article->id;
        $file = request()->file()[0];
        $path = $file->store($folder, 'public');

        $image = new Image();
        $image->user_id = $user->id;
        $image->url = Storage::url($path, 'public');
        $image->path = $path;
        $image->storage = 'public';

        $text = strip_tags($args['text']);
        if ($text) {
            $image->text = $text;
        }

        $image->save();

        $article->images()->attach($image);

        return $image;
    }
}
