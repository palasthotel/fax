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
use GraphQL\Error\Error;

class DeleteProfileImageMutation extends Mutation
{
    protected $attributes = ['name' => 'deleteProfileImage'];

    public function type()
    {
        return Type::boolean();
    }

    public function args()
    {
        return [];
    }

    public function resolve($root, $args)
    {
        $user = Auth::guard('api')->user();

        if ($user->profile_image) {
            $old = \App\Image::find($user->profile_image);
            if ($old) {
                Storage::disk('public')->delete($old->path);
                $user->profile_image = null;
                $user->save();
            } else {
                throw new Error("You don't have a profile image to delete.");
            }
        }

        return true;
    }
}
