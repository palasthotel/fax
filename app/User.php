<?php
namespace App;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Auth\Passwords\PasswordBroker;
use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = ['name', 'email', 'password', 'expertise'];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = ['password', 'remember_token'];

    /**
     * Get all of the pitches created by the user.
     */
    public function pitches()
    {
        return $this->hasMany(Pitch::class);
    }

    public function assignedPitches()
    {
        return $this->hasMany(Pitch::class);
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class);
    }

    public function expertises()
    {
        return $this->belongsToMany(Expertise::class);
    }

    public function locations()
    {
        return $this->belongsToMany(Location::class);
    }

    public function profileImage()
    {
        return $this->belongsTo(Image::class, 'profile_image');
    }

    /**
     * @param $roles
     *
     * @return bool
     */
    public function authorizeRoles($roles)
    {
        if (is_array($roles)) {
            return (
                $this->hasAnyRole($roles) ||
                abort(401, 'This action is unauthorized.')
            );
        }

        return (
            $this->hasRole($roles) || abort(401, 'This action is unauthorized.')
        );
    }

    /**
     * Check multiple roles
     *
     * @param $roles
     *
     * @return bool
     */
    public function hasAnyRole($roles)
    {
        return (
            null !==
            $this->roles()
                ->whereIn('name', $roles)
                ->first()
        );
    }

    /**
     * Check one role
     *
     * @param $role
     *
     * @return bool
     */
    public function hasRole($role)
    {
        return (
            null !==
            $this->roles()
                ->where('name', $role)
                ->first()
        );
    }

    /**
     * Check if user is editor
     *
     * @return bool
     */
    public function isEditor()
    {
        return $this->hasRole(Role::$ROLE_EDITOR);
    }

    /**
     * Check if user is freelancer
     *
     * @return bool
     */
    public function isFreelancer()
    {
        return $this->hasRole(Role::$ROLE_FREELANCER);
    }

    /**
     * Get role
     *
     * @return array
     */
    public function getRoles()
    {
        return $this->roles()
            ->pluck('name')
            ->toArray();
    }

    public function createResetToken()
    {
        $token = app('auth.password.broker')->createToken($this);

        MailHandler::sendPasswordResetToken($this, $token);
    }

    public function resetPassword($token, $password, $password_confirmation)
    {
        $password_broker = app('auth.password.broker');

        $credentials = [
            'email' => $this->email,
            'password' => $password,
            'password_confirmation' => $password_confirmation,
            'token' => $token
        ];

        $result = $password_broker->reset($credentials, function (
            $user,
            $password
        ) {
            $user->password = bcrypt($password);
            $user->save();
            //revoke old auth tokens
            $tokens = $user->tokens()->get();

            foreach ($tokens as $token) {
                $token->revoke();
            }
        });

        return $result;
    }
}
