<?php
namespace App\GraphQL\Mutation;

use App\Repositories\UserRepository;
use Auth;
use Folklore\GraphQL\Support\Mutation;
use GraphQL;
use GraphQL\Type\Definition\Type;
use Illuminate\Support\Facades\DB;

class UpdateUserMutation extends Mutation
{
    protected $attributes = ['name' => 'updateUser'];

    public function type()
    {
        return GraphQL::type('User');
    }

    public function args()
    {
        return [
            'id' => [
                'type' => Type::nonNull(Type::int()),
                'description' => 'The id of the user',
                'rules' => [
                    'int',
                    'required',
                    'exists:users,id',
                    function ($attribute, $value, $fail) {
                        $user = Auth::guard('api')->user();
                        $count = DB::table('users')
                            ->where('id', $user->id)
                            ->count();
                        if ($count < 1) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ],
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
            'phone' => [
                'type' => Type::string(),
                'description' => 'The phone of user',
                'rules' => ['string', 'required', 'min:1']
            ],
            'website' => [
                'type' => Type::string(),
                'description' => 'The website of user',
                'rules' => ['string']
            ],
            'facebook' => [
                'type' => Type::string(),
                'description' => 'The facebook of user',
                'rules' => ['string']
            ],
            'twitter' => [
                'type' => Type::string(),
                'description' => 'The twitter of user',
                'rules' => ['string']
            ],
            'instagram' => [
                'type' => Type::string(),
                'description' => 'The instagram of user',
                'rules' => ['string']
            ],
            'locations' => [
                'type' => Type::listOf(Type::int()),
                'description' => 'The locations of the user',
                'rules' => [
                    'array',
                    'required',
                    'min:1',
                    function ($attribute, $value, $fail) {
                        $count = DB::table('locations')
                            ->whereIn('id', $value)
                            ->count();
                        if ($count !== count($value)) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ],
            'expertises' => [
                'type' => Type::listOf(Type::int()),
                'description' => 'The expertises of the user',
                'rules' => [
                    'array',
                    'required',
                    'min:1',
                    function ($attribute, $value, $fail) {
                        $count = DB::table('expertises')
                            ->whereIn('id', $value)
                            ->count();
                        if ($count !== count($value)) {
                            return $fail($attribute . ' is invalid.');
                        }
                    }
                ]
            ],
            'expertise' => [
                'type' => Type::string(),
                'description' => 'Some custom expertise entries',
                'rules' => ['string']
            ]
        ];
    }

    public function resolve($root, $args)
    {
        $id = intval($args['id']);
        $first_name = filter_var($args['firstName'], FILTER_SANITIZE_STRING);
        $last_name = filter_var($args['lastName'], FILTER_SANITIZE_STRING);
        $phone = filter_var($args['phone'], FILTER_SANITIZE_STRING);
        $website = filter_var($args['website'], FILTER_SANITIZE_STRING);
        $facebook = filter_var($args['facebook'], FILTER_SANITIZE_STRING);
        $twitter = filter_var($args['twitter'], FILTER_SANITIZE_STRING);
        $instagram = filter_var($args['instagram'], FILTER_SANITIZE_STRING);
        $locations = $args['locations'];
        $expertises = $args['expertises'];
        $expertise = (!empty($args['expertise']))?strip_tags($args['expertise']):false;

        $user = UserRepository::getById($id);
        $user->first_name = $first_name;
        $user->last_name = $last_name;
        $user->phone = $phone;
        $user->website = $website;
        $user->facebook = $facebook;
        $user->twitter = $twitter;
        $user->instagram = $instagram;
        $user->expertise = $expertise;
        $user->save();

        $user->locations()->sync($locations);
        $user->expertises()->sync($expertises);

        return $user;
    }
}
