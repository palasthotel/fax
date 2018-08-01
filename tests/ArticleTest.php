<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\GraphQL\Query\ArticleQuery;
use App\GraphQL\Query\ArticlesQuery;
use App\GraphQL\Mutation\RateArticleMutation;

class ArticleTest extends TestCase
{

    /**
     * - Check if votes higher then 5 and less then 1 are not allowed
     * - Check if votes are stored in the database
     */
    public function testArticleVote(){

      $user = \App\User::find(5);
      $this->actingAs($user, 'api');

      $args = [
        'id' => 7,
        'rating' => 4
      ];

      $query = new RateArticleMutation();
      $query->resolve(null, $args);

      $article = \App\Article::find(7);
      $this->assertEquals(4, $article->rating);
    }
}
