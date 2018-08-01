<?php

use Illuminate\Foundation\Testing\WithoutMiddleware;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

use App\GraphQL\Query\ArticleQuery;
use App\GraphQL\Query\ArticlesQuery;
use App\GraphQL\Mutation\VoteArticleMutation;

class StorageTest extends TestCase
{
    /**
     * Check if linebreaks inside articles are converted to <br/> Tags
     * in a single query
     *
     * @return void
     */
    public function testFolderStructure()
    {
      $this->assertFileExists('storage/app/public');
      $this->assertFileExists('storage/framework/cache');
      $this->assertFileExists('storage/framework/sessions');
      $this->assertFileExists('storage/framework/views');

      $this->assertFileExists('storage/logs');
      $this->assertFileExists('.env');
      $this->assertFileExists('bootstrap/cache');
    }
}
