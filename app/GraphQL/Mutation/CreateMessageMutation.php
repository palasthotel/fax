<?php
namespace App\GraphQL\Mutation;

use App\MailHandler;
use App\Message;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Validation\Rule;

class CreateMessageMutation extends Mutation
{
    protected $attributes = ['name' => 'createMessage'];

    public function type()
    {
        return GraphQL::type('Message');
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
                    Rule::exists('pitches', 'id')->where(function ($query) {
                        $user = Auth::guard('api')->user();
                        if (!$user->isEditor()) {
                            $query->where('user_id', $user->id);
                        }
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
        $user = Auth::guard('api')->user();
        $pitch_id = intval($args['pitchId']);
        $text = strip_tags($args['text']);

        $message = new Message();
        $message->user_id = $user->id;
        $message->pitch_id = $pitch_id;
        $message->text = $text;
        $message->save();

        $pitch = \App\Pitch::find($pitch_id);

        if ($user->id != $pitch->user_id) {
            MailHandler::sendNewMessage($pitch_id, $message);
        }

        return $message;
    }
}
