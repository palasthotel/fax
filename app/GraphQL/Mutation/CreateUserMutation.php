<?php
namespace App\GraphQL\Mutation;

use App\MailHandler;
use App\Role;
use App\User;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;

class CreateUserMutation extends Mutation
{
    protected $attributes = ['name' => 'createUser'];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [
            'firstName' => [
                'type' => Type::string(),
                'description' => 'The first name of user',
                'rules' => ['string', 'required', 'min:1']
            ],
            'lastName' => [
                'type' => Type::string(),
                'description' => 'The last name of user',
                'rules' => ['string', 'required', 'min:1']
            ],
            'email' => [
                'type' => Type::string(),
                'description' => 'The email of user',
                'rules' => ['string', 'required', 'email', 'unique:users,email']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $current_user = Auth::guard('api')->user();
        if (!$current_user->isEditor()) {
            throw new Error("You are not allowed to create new users.");
        }

        $user = new User();
        $user->first_name = $args['firstName'];
        $user->last_name = $args['lastName'];
        $user->email = $args['email'];
        $user->password = bcrypt(str_random(10));
        $user->save();

        $role_external = Role::where('name', 'FREELANCER')->first();
        $user->roles()->attach($role_external);

        MailHandler::sendUserCreated($user);

        return $user;
    }
}
