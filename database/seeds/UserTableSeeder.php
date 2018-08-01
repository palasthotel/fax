<?php
use Illuminate\Database\Seeder;
use App\User;
use App\Role;
use App\Expertise;
use App\Location;

class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_external = Role::where('name', 'FREELANCER')->first();
        $role_editor = Role::where('name', 'EDITOR')->first();

        $expertise_sport = Expertise::where('name', 'Sport')->first();
        $expertise_politics = Expertise::where('name', 'Politik')->first();
        $expertise_music = Expertise::where('name', 'Musik')->first();

        $location_berlin = Location::where('name', 'Berlin')->first();
        $location_muenchen = Location::where('name', 'München')->first();

        //external user
        $external_user = new User();
        $external_user->first_name = 'Fritz';
        $external_user->last_name = 'Freelance';
        $external_user->email = 'fritz@example.com';
        $external_user->password = bcrypt('secret');
        $external_user->phone = '0123/456789';
        $external_user->website = 'http://www.fritz-freelance.com';
        $external_user->facebook = 'http://facebook.com/fritz.freelance';
        $external_user->twitter = 'http://twitter.com/fritz.freelance';
        $external_user->instagram = 'http://instagram.com/fritz.freelance';
        $external_user->save();
        $external_user->roles()->attach($role_external);
        $external_user->expertises()->attach($expertise_sport);
        $external_user->expertises()->attach($expertise_music);
        $external_user->locations()->attach($location_berlin);

        $external_user1 = new User();
        $external_user1->first_name = 'Franziska';
        $external_user1->last_name = 'Frei';
        $external_user1->email = 'franziska@example.com';
        $external_user1->password = bcrypt('secret');
        $external_user1->phone = '0123/456789';
        $external_user1->website = 'http://www.franziska-frei.com';
        $external_user1->facebook = 'http://facebook.com/franziska.frei';
        $external_user1->twitter = 'http://twitter.com/franziska.frei';
        $external_user1->instagram = 'http://instagram.com/franziska.frei';
        $external_user1->save();
        $external_user1->roles()->attach($role_external);
        $external_user1->expertises()->attach($expertise_politics);
        $external_user1->locations()->attach($location_muenchen);

        //editor
        $editor = new User();
        $editor->first_name = 'Eddi';
        $editor->last_name = 'Redakteur';
        $editor->email = 'eddi@example.com';
        $editor->password = bcrypt('secret');
        $editor->phone = '0123/456789';
        $editor->save();
        $editor->roles()->attach($role_editor);
    }
}
