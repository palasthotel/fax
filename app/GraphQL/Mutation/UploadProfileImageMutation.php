<?php
namespace App\GraphQL\Mutation;

use App\Repositories\UserRepository;
use App\Image;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use App\GraphQL\Type\Scalar\UploadType;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UploadProfileImageMutation extends Mutation
{
    protected $attributes = ['name' => 'uploadProfileImage'];

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
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $user = Auth::guard('api')->user();

        if ($user->profile_image) {
            $old = Image::find($user->profile_image);
            if ($old) {
                Storage::disk('public')->delete($old->path);
            }
            $user->profile_image = null;
            $user->save();
        }

        $folder = '/img/profile/' . $user->id;
        $file = request()->file()[0];
        $path = $file->store($folder, 'public');

        $image = new Image();
        $image->user_id = $user->id;
        $image->url = Storage::url($path, 'public');
        $image->path = $path;
        $image->storage = 'public';
        $image->save();

        $user->profile_image = $image->id;
        $user->save();

        return $image;
    }
}
