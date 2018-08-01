<?php
use Illuminate\Database\Seeder;
use App\Location;

class LocationTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $location_berlin = new Location();
        $location_berlin->name = 'Berlin';
        $location_berlin->save();

        $location_hamburg = new Location();
        $location_hamburg->name = 'Hamburg';
        $location_hamburg->save();

        $location_muenchen = new Location();
        $location_muenchen->name = 'München';
        $location_muenchen->save();

        $location_koeln = new Location();
        $location_koeln->name = 'Köln';
        $location_koeln->save();
    }
}
