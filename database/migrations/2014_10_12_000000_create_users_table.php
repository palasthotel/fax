<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id');
            $table
                ->integer('profile_image')
                ->nullable()
                ->default(null);
            $table->string('first_name')->nullable(false);
            $table->string('last_name')->nullable(false);
            $table
                ->string('email')
                ->unique()
                ->nullable(false);
            $table->string('password')->nullable(false);
            $table->string('phone')->nullable(false);
            $table->string('website');
            $table->string('facebook');
            $table->string('twitter');
            $table->string('instagram');
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('location_user');
        Schema::dropIfExists('expertise_user');
        Schema::dropIfExists('pitches');
        Schema::dropIfExists('password_resets');
        Schema::dropIfExists('images');
        Schema::dropIfExists('users');
    }
}
