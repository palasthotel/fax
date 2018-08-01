<?php
use Illuminate\Database\Seeder;
use App\Role;

class RoleTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $role_editor = new Role();
        $role_editor->name = 'EDITOR';
        $role_editor->description = 'An Editor';
        $role_editor->save();
        $role_external = new Role();
        $role_external->name = 'FREELANCER';
        $role_external->description = 'A Freelancer';
        $role_external->save();
    }
}
