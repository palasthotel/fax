<?php
use Illuminate\Database\Seeder;
use App\Image;
use App\User;

class ImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $franziska = User::where('first_name', 'Franziska')->first();

        $franziskas_first_image = new Image();
        $franziskas_first_image->user_id = $franziska->id;
        $franziskas_first_image->url = "/1.jpg";
        $franziskas_first_image->text = "A beautiful image";
        $franziskas_first_image->save();

        $franziska->profile_image = $franziskas_first_image->id;
        $franziska->save();

        $fritz = User::where('first_name', 'Fritz')->first();

        $fritz_first_image = new Image();
        $fritz_first_image->user_id = $fritz->id;
        $fritz_first_image->url = "/2.jpg";
        $fritz_first_image->text = "Another beautiful image";
        $fritz_first_image->save();

        $fritz->profile_image = $fritz_first_image->id;
        $fritz->save();

        $first_article_image = new Image();
        $first_article_image->user_id = $franziska->id;
        $first_article_image->url = "/3.jpg";
        $first_article_image->text = "One more beautiful image";
        $first_article_image->save();

        $second_article_image = new Image();
        $second_article_image->user_id = $franziska->id;
        $second_article_image->url = "/4.jpg";
        $second_article_image->text = "One more beautiful image";
        $second_article_image->save();
    }
}
