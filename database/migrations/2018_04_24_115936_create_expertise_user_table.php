<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpertiseUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expertise_user', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('expertise_id')->unsigned();
            $table->integer('user_id')->unsigned();
        });

        Schema::table('expertise_user', function ($table) {
            $table
                ->foreign('expertise_id')
                ->references('id')
                ->on('expertises')
                ->onDelete('cascade');
            $table
                ->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('expertise_user');
    }
}
