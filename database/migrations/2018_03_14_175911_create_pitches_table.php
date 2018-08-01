<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Pitch;

class CreatePitchesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pitches', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table
                ->integer('assignee_id')
                ->nullable()
                ->default(null);
            $table->string('title');
            $table->text('description');
            $table->string('state')->default(Pitch::$STATE_NEW);
            $table->date('deadline');
            $table->timestamps();
        });

        Schema::table('pitches', function ($table) {
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
        Schema::dropIfExists('articles');
        Schema::dropIfExists('pitches');
    }
}
