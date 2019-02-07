<?php
namespace App\Policies;

use App\User;
use App\Pitch;
use Illuminate\Auth\Access\HandlesAuthorization;

class PitchPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the given user can delete the given pitch.
     *
     * @param  User  $user
     * @param  Pitch $pitch
     *
     *@return bool
     */
    public function destroy(User $user, Pitch $pitch)
    {
        return $user->id === $pitch->user_id;
    }
}
