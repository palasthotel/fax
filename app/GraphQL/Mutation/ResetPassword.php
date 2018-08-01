<?php
namespace App\GraphQL\Mutation;

use App\User;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;
use Illuminate\Auth\Passwords\PasswordBroker;

class ResetPassword extends Mutation
{
    protected $attributes = ['name' => 'resetPassword'];

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
            ],
            'newPassword' => [
                'name' => 'newPassword',
                'type' => Type::string(),
                'rules' => ['string', 'required', 'min:10']
            ],
            'token' => [
                'name' => 'token',
                'type' => Type::string(),
                'rules' => ['string', 'required']
            ]
        ];
    }

    protected function getValidationMessages()
    {
        return [
            'email.required' =>
                'The selected email is invalid. Please check the link we’ve sent you via email.',
            'email.exists' =>
                'The selected email is invalid. Please check the link we’ve sent you via email.',
            'email.string' =>
                'The selected email is invalid. Please check the link we’ve sent you via email.'
        ];
    }

    protected function getValidator($args, $rules, $messages = [])
    {
        $messages = $this->getValidationMessages();

        $validator = app('validator')->make($args, $rules, $messages);

        if (method_exists($this, 'withValidator')) {
            $this->withValidator($validator, $args);
        }

        return $validator;
    }

    public function resolve($root, $args)
    {
        $user = User::where('email', $args['email'])->first();
        if ($user instanceof User) {
            $password = $args['newPassword'];
            $password_confirmation = $password; //Hack, because we don't want confirmation
            $token = $args['token'];

            $result = $user->resetPassword(
                $token,
                $password,
                $password_confirmation
            );

            switch ($result) {
                case PasswordBroker::PASSWORD_RESET:
                    return true;
                case PasswordBroker::INVALID_TOKEN:
                    throw new Error(
                        "Invalid token. Please check the link we’ve went you via email or request an new reset link."
                    );
                default:
                    throw new Error(
                        "Incorrect credentials. Please check the link we’ve went you via email or request an new reset link."
                    );
            }

            return true;
        }

        throw new Error("Unkown user.");

        return false;
    }
}
