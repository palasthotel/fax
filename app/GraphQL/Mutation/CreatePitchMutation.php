<?php
namespace App\GraphQL\Mutation;

use App\Pitch;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Error\Error;
use GraphQL\Type\Definition\Type;

class CreatePitchMutation extends Mutation
{
    protected $attributes = ['name' => 'createPitch'];

    public function type()
    {
        return GraphQL::type('Pitch');
    }

    public function args()
    {
        return [
            'title' => [
                'name' => 'title',
                'type' => Type::string(),
                'rules' => ['string', 'required', 'min:1']
            ],
            'description' => [
                'name' => 'description',
                'type' => Type::string(),
                'rules' => ['string', 'required', 'min:1']
            ],
            'deadline' => [
                'name' => 'deadline',
                'type' => Type::string(),
                'rules' => [
                    'date_format:"Y-m-d"',
                    'required',
                    function ($attribute, $value, $fail) {
                        $datetime = new \DateTime('tomorrow');
                        if ($value < $datetime->format('Y-m-d')) {
                            return $fail(
                                'The deadline has to be in the future.'
                            );
                        }
                    }
                ]
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $title = strip_tags($args['title']);
        $description = strip_tags($args['description']);
        $deadline = strip_tags($args['deadline']);
        $user = Auth::guard('api')->user();

        if (!$user->isFreelancer()) {
            throw new Error("You don't have permission to create a pitch.");
            return;
        }

        $pitch = new Pitch();
        $pitch->user_id = $user->id;
        $pitch->title = $title;
        $pitch->description = $description;
        $pitch->deadline = $deadline;
        $pitch->save();

        return $pitch;
    }
}
