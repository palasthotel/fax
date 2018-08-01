<?php
use Illuminate\Database\Seeder;
use App\User;
use App\Pitch;

class PitchTableSeeder extends Seeder
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
        $user_freelance1 = User::where('email', 'fritz@example.com')->first();
        $user_editor = User::where('email', 'eddi@example.com')->first();

        $franziskas_first_pitch = new Pitch();
        $franziskas_first_pitch->user_id = $user_freelance->id;
        $franziskas_first_pitch->assignee_id = $user_editor->id;
        $franziskas_first_pitch->title = 'Franziskas first Pitch';
        $franziskas_first_pitch->description =
            'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz';
        $franziskas_first_pitch->deadline = '2018-04-30';
        $franziskas_first_pitch->save();

        $franziskas_second_pitch = new Pitch();
        $franziskas_second_pitch->title = 'Franziskas second Pitch';
        $franziskas_second_pitch->user_id = $user_freelance->id;
        $franziskas_second_pitch->assignee_id = $user_editor->id;
        $franziskas_second_pitch->description =
            'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz';
        $franziskas_second_pitch->deadline = '2018-04-30';
        $franziskas_second_pitch->state = Pitch::$STATE_WORK_IN_PROGRESS;
        $franziskas_second_pitch->save();

        $fritz_first_pitch = new Pitch();
        $fritz_first_pitch->title = 'Fritz first Pitch';
        $fritz_first_pitch->user_id = $user_freelance1->id;
        $fritz_first_pitch->assignee_id = $user_editor->id;
        $fritz_first_pitch->description =
            'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz';
        $fritz_first_pitch->deadline = '2018-05-02';
        $fritz_first_pitch->save();

        $fritz_second_pitch = new Pitch();
        $fritz_second_pitch->title = 'Fritz second Pitch';
        $fritz_second_pitch->user_id = $user_freelance1->id;
        $fritz_second_pitch->assignee_id = $user_editor->id;
        $fritz_second_pitch->description =
            'Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz';
        $fritz_second_pitch->deadline = '2018-05-15';
        $fritz_second_pitch->save();
    }
}
