<?php
use Illuminate\Database\Seeder;
use App\User;
use App\Pitch;
use App\Message;

class MessagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $user_freelance = User::where(
            'email',
            'franziska@example.com'
        )->first();
        $user_editor = User::where('email', 'eddi@example.com')->first();
        $pitch = Pitch::where('title', 'Franziskas first Pitch')->first();

        $franziskas_first_message = new Message();
        $franziskas_first_message->user_id = $user_freelance->id;
        $franziskas_first_message->pitch_id = $pitch->id;
        $franziskas_first_message->text = 'hallo!';
        $franziskas_first_message->save();

        $eddis_first_message = new Message();
        $eddis_first_message->user_id = $user_editor->id;
        $eddis_first_message->pitch_id = $pitch->id;
        $eddis_first_message->text = 'hallo zurück!';
        $eddis_first_message->save();
    }
}
