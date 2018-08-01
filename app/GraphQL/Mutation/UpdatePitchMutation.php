<?php
namespace App\GraphQL\Mutation;

use App\Repositories\PitchRepository;
use App\Repositories\UserRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\DB;

class UpdatePitchMutation extends Mutation
{
    protected $attributes = ['name' => 'updatePitch'];

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
                'rules' => [
                    'int',
                    'required',
                    'exists:pitches,id',
                    function ($attribute, $value, $fail) {
                        $user = Auth::guard('api')->user();
                        $count = DB::table('pitches')
                            ->where('pitches.id', $value)
                            ->where('pitches.user_id', $user->id)
                            ->count();
                        if ($count < 1 && !$user->isEditor()) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ],
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
                'rules' => ['date_format:"Y-m-d"', 'required']
            ],
            'assignee' => [
                'name' => 'assignee',
                'type' => Type::int(),
                'rules' => [
                    'int',
                    'exists:users,id',
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!empty($value)) {
                            $user = UserRepository::getById($value);
                            if (!$user->isEditor()) {
                                return $fail(
                                    'User can not be assigned to pitch.'
                                );
                            }
                        }
                    }
                ]
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $user = Auth::guard('api')->user();
        $id = intval($args['id']);
        $title = strip_tags($args['title']);
        $description = strip_tags($args['description']);
        $deadline = strip_tags($args['deadline']);
        $assignee_id = (!empty($args['assignee']))
            ? strip_tags($args['assignee'])
            : null;

        $pitch = PitchRepository::getById($id);

        //user can change values of his own pitch
        if ($user->id === $pitch->user_id) {
            $pitch->title = $title;
            $pitch->description = $description;
            $pitch->deadline = $deadline;
        }

        //Editor can change assignee
        if ($user->isEditor()) {
            $pitch->assignee_id = $assignee_id;
        }

        $pitch->save();

        return $pitch;
    }
}
