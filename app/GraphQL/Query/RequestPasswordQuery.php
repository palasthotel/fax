<?php
namespace App\GraphQL\Query;

use App\User;
use Folklore\GraphQL\Support\Query;
use Folklore\GraphQL\Support\Traits\ShouldValidate;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;

class RequestPasswordQuery extends Query
{
    use ShouldValidate;

    protected $attributes = ['name' => 'requestPassword'];

    public function type()
    {
        return Type::boolean();
    }

    public function args()
    {
        return [
            'email' => [
                'name' => 'email',
                'type' => Type::string(),
                'rules' => ['string', 'required', 'exists:users,email']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $user = User::where('email', $args['email'])->first();
        if ($user) {
            $user->createResetToken();

            return true;
        }
    }
}
