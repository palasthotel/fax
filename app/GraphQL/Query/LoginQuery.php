<?php
namespace App\GraphQL\Query;

use App\User;
use Folklore\GraphQL\Support\Query;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;

class LoginQuery extends Query
{
    protected $attributes = ['name' => 'login'];

    public function type()
    {
        return Type::string();
    }

    public function args()
    {
        return [
            'password' => ['name' => 'password', 'type' => Type::string()],
            'email' => ['name' => 'email', 'type' => Type::string()]
        ];
    }

    public function resolve($root, $args)
    {
        if (!isset($args['email']) || !isset($args['password'])) {
            throw new Error('Missing email or password.');
        }

        $user = User::where('email', $args['email'])->first();
        if ($user && \Hash::check($args['password'], $user->password)) {
            return $user->createToken('Fax App')->accessToken;
        }
        throw new Error('Invalid login data.');
    }
}
