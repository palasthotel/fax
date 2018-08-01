<?php
namespace App\Http\Middleware;

use Closure;

class UploadMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $request = $this->processRequest($request);
        return $next($request);
    }

    /**
     * Process the request and return either a modified request or the original one
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Request
     */
    public function processRequest(
        \Illuminate\Http\Request $request
    ): \Illuminate\Http\Request {
        // check if post request with files
        if ($request->isMethod('post') && $request->file(0)) {
            $this->validateParsedBody($request);
            $request = $this->parseUploadedFiles($request);
        }

        return $request;
    }

    /**
     * Inject uploaded files defined in the 'map' key into the 'variables' key
     *
     * @param \Illuminate\Http\Request $request
     *
     * @return \Illuminate\Http\Request
     */
    private function parseUploadedFiles(
        \Illuminate\Http\Request $request
    ): \Illuminate\Http\Request {
        $bodyParams = $request->getContent();

        if (!$bodyParams) {
            $bodyParams = $request->all();
        }

        $map = json_decode($bodyParams['map'], true);
        $result = json_decode($bodyParams['operations'], true);

        if (isset($result['operationName'])) {
            $result['operation'] = $result['operationName'];
            unset($result['operationName']);
        }

        foreach ($map as $fileKey => $locations) {
            foreach ($locations as $location) {
                $items = &$result;
                foreach (explode('.', $location) as $key) {
                    if (!isset($items[$key]) || !is_array($items[$key])) {
                        $items[$key] = [];
                    }
                    $items = &$items[$key];
                }

                $items = $request->file()[$fileKey];
            }
        }

        $request->merge($result);
        $request->attributes->add($result);
        $request->setJson($request->attributes);

        $request->headers->set('content-type', 'application/json');

        return $request;
    }

    /**
     * Validates that the request meet our expectations
     *
     * @param \Illuminate\Http\Request $request
     */
    private function validateParsedBody(
        \Illuminate\Http\Request $request
    ): void {
        $bodyParams = $request->getContent();

        if (!$bodyParams) {
            $bodyParams = $request->all();
        }

        if (null === $bodyParams) {
            throw new \Exception(
                'PSR-7 request is expected to provide parsed body for "multipart/form-data" requests but got null'
            );
        }

        if (!is_array($bodyParams)) {
            throw new \Exception(
                'GraphQL Server expects JSON object or array, but got ' .
                    Utils::printSafeJson($bodyParams)
            );
        }

        if (empty($bodyParams)) {
            throw new \Exception(
                'PSR-7 request is expected to provide parsed body for "multipart/form-data" requests but got empty array'
            );
        }
    }
}
