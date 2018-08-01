<?php
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Role comes before User seeder here.
        $this->call(RoleTableSeeder::class);
        $this->call(LocationTableSeeder::class);
        $this->call(ExpertisesTableSeeder::class);
        // User seeder will use the roles above created.
        $this->call(UserTableSeeder::class);
        // pitches seeder
        $this->call(PitchTableSeeder::class);
        //images seeder
        //$this->call(ImagesTableSeeder::class);
        // article seeder
        $this->call(ArticleTableSeeder::class);
        //messages seeder
        $this->call(MessagesTableSeeder::class);
    }
}
