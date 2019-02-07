<?php
namespace App\GraphQL\Mutation;

use App\Image;
use App\Repositories\UserRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use GraphQL\Upload\UploadType;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class DeleteArticleImageMutation extends Mutation
{
    protected $attributes = ['name' => 'deleteArticleImage'];

    public function type()
    {
        return Type::boolean();
    }

    public function args()
    {
        return [
            'id' => [
                'type' => Type::int(),
                'description' => 'Id of image to be deleted',
                'rules' => [
                    'required',
                    'int',
                    //check if image exists and is from current user
                    Rule::exists('images', 'id')->where(function ($query) {
                        $user = Auth::guard('api')->user();
                        $query
                            ->where('user_id', $user->id)
                            ->where('deleted', false);
                    })
                ]
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = $args['id'];

        $image = Image::where('id', $id)->first();
        Storage::disk('public')->delete($image->path);
        $image->articles()->detach();
        $image->delete();

        return true;
    }
}
