<?php
namespace App\GraphQL\Mutation;

use App\Pitch;
use App\Repositories\PitchRepository;
use Auth;
use App\MailHandler;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;

class UpdatePitchStateMutation extends Mutation
{
    protected $attributes = ['name' => 'updatePitchState'];

    public function type()
    {
        return GraphQL::type('Pitch');
    }

    public function args()
    {
        return [
            'id' => [
                'name' => 'id',
                'type' => Type::int(),
                'rules' => ['int', 'required', 'exists:pitches,id']
            ],
            'state' => [
                'name' => 'state',
                'type' => Type::string(),
                'rules' => [
                    'string',
                    'required',
                    'min:1',
                    function ($attribute, $value, $fail) {
                        if (
                            $value !== Pitch::$STATE_REJECTED &&
                            $value !== Pitch::$STATE_WORK_IN_PROGRESS &&
                            $value !== Pitch::$STATE_APPROVAL &&
                            $value !== Pitch::$STATE_CANCELED &&
                            $value !== Pitch::$STATE_PUBLISHED
                        ) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = intval($args['id']);
        $state = filter_var($args['state'], FILTER_SANITIZE_STRING);
        $user = Auth::guard('api')->user();

        $pitch = PitchRepository::getById($id);

        if (!$user->hasRole('EDITOR') && $user->id != $pitch->user_id) {
            throw new \Exception(
                "This is not one of your pitches, you are only allowed to update your own pitches."
            );
        }

        $oldState = $pitch->state;
        $checkResult = $pitch->updateState($state);

        if ($checkResult === Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE) {
            throw new \Exception(
                "Changing the state from $oldState to $state is not possible."
            );
        }

        if ($checkResult === Pitch::$ERROR_STATECHANGE_NOT_ALLOWED) {
            throw new \Exception(
                "You are not allowed to change the state from $oldState to $state."
            );
        }

        if ($checkResult === Pitch::$ERROR_STATECHANGE_FINAL_STATE) {
            throw new \Exception(
                "The state $oldState is a final state, you cant change it."
            );
        }

        $pitch->save();
        MailHandler::sendStateChanged($pitch, $state);

        return $pitch;
    }
}
