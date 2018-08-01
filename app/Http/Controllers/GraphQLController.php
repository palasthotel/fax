<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Folklore\GraphQL\GraphQLController as BaseGraphQLController;
use GraphQL\Upload\UploadMiddleware;
use Symfony\Bridge\PsrHttpMessage\Factory\HttpFoundationFactory;
use Symfony\Bridge\PsrHttpMessage\Factory\DiactorosFactory;

class GraphQLController extends BaseGraphQLController
{
    public function query(Request $request, $schema = null)
    {
        return parent::query($request, $schema);
    }
}
