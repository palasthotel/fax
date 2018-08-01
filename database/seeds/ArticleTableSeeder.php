<?php
use Illuminate\Database\Seeder;
use App\Pitch;
use App\Article;
use App\Image;

class ArticleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $franziskas_first_pitch = Pitch::where(
            'title',
            'Franziskas first Pitch'
        )->first();
        $franziskas_second_pitch = Pitch::where(
            'title',
            'Franziskas second Pitch'
        )->first();
        $fritz_first_pitch = Pitch::where(
            'title',
            'Fritz first Pitch'
        )->first();

        $franziskas_first_article = new Article();
        $franziskas_first_article->pitch_id = $franziskas_first_pitch->id;
        $franziskas_first_article->title = "Franzikas first Article";
        $franziskas_first_article->text =
            "Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz";
        $franziskas_first_article->lead = "This is a lead text for an article";
        $franziskas_first_article->note = "Please note that this is a note";
        $franziskas_first_article->rating = 3;
        $franziskas_first_article->save();

        /*$first_image = Image::where('url', '/3.jpg')->first();
	    $franziskas_first_article->images()->attach( $first_image );
	    $second_image = Image::where('url', '/4.jpg')->first();
	    $franziskas_first_article->images()->attach( $second_image );*/

        $franziskas_second_article = new Article();
        $franziskas_second_article->pitch_id = $franziskas_second_pitch->id;
        $franziskas_second_article->title = "Franzikas second Article";
        $franziskas_second_article->text =
            "Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz";
        $franziskas_second_article->lead = "This is a lead text for an article";
        $franziskas_second_article->note = "Please note that this is a note";
        $franziskas_second_article->rating = 3;
        $franziskas_second_article->save();

        $fritz_first_article = new Article();
        $fritz_first_article->pitch_id = $fritz_first_pitch->id;
        $fritz_first_article->title = "Fritz first Article";
        $fritz_first_article->text =
            "Auch gibt es niemanden, der den Schmerz an sich liebt, sucht oder wünscht, nur, weil er Schmerz ist, es sei denn, es kommt zu zufälligen Umständen, in denen Mühen und Schmerz ihm große Freude bereiten können. Um ein triviales Beispiel zu nehmen, wer von uns unterzieht sich je anstrengender körperlicher Betätigung, außer um Vorteile daraus zu ziehen? Aber wer hat irgend ein Recht, einen Menschen zu tadeln, der die Entscheidung trifft, eine Freude zu genießen, die keine unangenehmen Folgen hat, oder einen, der Schmerz vermeidet, welcher keine daraus resultierende Freude nach sich zieht?Auch gibt es niemanden, der den Schmerz";
        $fritz_first_article->lead = "This is a lead text for an article";
        $fritz_first_article->note = "Please note that this is a note";
        $fritz_first_article->rating = 3;
        $fritz_first_article->save();
    }
}
