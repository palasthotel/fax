<?php
use Illuminate\Database\Seeder;
use App\Expertise;

class ExpertisesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $expertise1 = new Expertise();
        $expertise1->name = 'Politik';
        $expertise1->save();

        $expertise2 = new Expertise();
        $expertise2->name = 'Sport';
        $expertise2->save();

        $expertise3 = new Expertise();
        $expertise3->name = 'Musik';
        $expertise3->save();
    }
}
