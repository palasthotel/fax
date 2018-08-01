<?php
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('pitch_id')->unsigned();
            $table->string('title');
            $table->text('text');
            $table->text('lead');
            $table->text('note');
            $table->integer('rating');
            $table->timestamps();
        });

        Schema::table('articles', function ($table) {
            $table
                ->foreign('pitch_id')
                ->references('id')
                ->on('pitches')
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
    }
}
