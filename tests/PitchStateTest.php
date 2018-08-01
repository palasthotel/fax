<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\GraphQL\Query\ArticleQuery;
use App\GraphQL\Query\ArticlesQuery;
use App\GraphQL\Mutation\RateArticleMutation;

class PitchStateTest extends TestCase
{

    /**
     * - Check if votes higher then 5 and less then 1 are not allowed
     * - Check if votes are stored in the database
     */
    public function testEditorChanges(){

      $user = \App\User::whereHas('roles', function ($query) {
        $query->where('name', '=', 'editor');
      })->first();

      $this->actingAs($user, 'api');

       $pitch = new \App\Pitch();
       $pitch->state = 'new';

       $this->assertEquals($pitch->updateState('rejected'), true);
       $pitch->state = 'new';

       $this->assertEquals($pitch->updateState('work in progress'), true);

       // only freelancer can request approval
       $this->assertEquals($pitch->updateState('approval'), \App\Pitch::$ERROR_STATECHANGE_NOT_ALLOWED);

       $pitch->state = 'approval';
       $this->assertEquals($pitch->updateState('published'), true);
       $this->assertEquals($pitch->updateState('approval'), \App\Pitch::$ERROR_STATECHANGE_FINAL_STATE);

       // changing back to a previous state is not possible
       $pitch->state = 'approval';
       $this->assertEquals($pitch->updateState('approval'), \App\Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE);
       $this->assertEquals($pitch->updateState('work in progress'), \App\Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE);
       $this->assertEquals($pitch->updateState('rejected'), \App\Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE);

       // jumping states not possible
       $pitch->state = 'new';
       $this->assertEquals($pitch->updateState('approval'), \App\Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE);
    }

    public function testFreelancerChanges(){

      $user = \App\User::whereHas('roles', function ($query) {
        $query->where('name', '=', 'freelancer');
      })->first();

      $this->actingAs($user, 'api');

      $pitch = new \App\Pitch();
      $pitch->state = 'new';
      $this->assertEquals($pitch->updateState('work in progress'), \App\Pitch::$ERROR_STATECHANGE_NOT_ALLOWED);
      $this->assertEquals($pitch->updateState('approval'), \App\Pitch::$ERROR_STATECHANGE_NOT_POSSIBLE);

      $pitch->state = 'work in progress';
      $this->assertEquals($pitch->updateState('approval'), true);
    }
}
