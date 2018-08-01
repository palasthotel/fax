<?php
namespace App\GraphQL\Mutation;

use App\Repositories\MessageRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Validation\Rule;

class UpdateMessageMutation extends Mutation
{
    protected $attributes = ['name' => 'updateMessage'];

    public function type()
    {
        return GraphQL::type('Message');
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
                    Rule::exists('messages', 'id')->where(function ($query) {
                        $user = Auth::guard('api')->user();
                        $query->where('user_id', $user->id);
                    })
                ]
            ],
            'text' => [
                'name' => 'text',
                'type' => Type::string(),
                'rules' => ['string']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = intval($args['id']);
        $text = strip_tags($args['text']);

        $message = MessageRepository::getById($id);
        $message->text = $text;
        $message->save();

        return $message;
    }
}
