<?php
namespace App\Exceptions;
use Exception;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Predis\Connection\ConnectionException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Session\TokenMismatchException;
use Auth;
class Handler extends ExceptionHandler {

  /**
   * A list of the exception types that should not be reported.
   *
   * @var array
   */
  protected $dontReport = [
    AuthorizationException::class,
    HttpException::class,
    ModelNotFoundException::class,
    ValidationException::class,
  ];
  
  protected function unauthenticated($request) {
    if ($request->expectsJson()) {
      return response()->json(['error' => 'Unauthenticated.'], 401);
    }
    return redirect()->guest('login');
  }


  /**
  * Report or log an exception.
  *
  * This is a great spot to send exceptions to Sentry, Bugsnag, etc.
  *
  * @param  \Exception  $e
  * @return void
  */
  public function report(Exception $e) {
    
    if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException){}
    else if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException){}
    else if ($e instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException){}
    else if ($e instanceof TokenMismatchException) {}
    else if ($e instanceof ValidationException) {}
    else if ($e instanceof AuthenticationException){}
    else if ($e instanceof \Illuminate\Auth\AuthenticationException){}
    else if ($e instanceof \Illuminate\Database\QueryException)  {}
    else if ($e instanceof Predis\Connection\ConnectionException) {}  
    else {
      if (Auth::Check()) {
        $user = Auth::user();
      }
      $user_data = [];
      if (isset($user)) {
        $user_data = ['id' => $user->id, 'username' => $user->first_name . ' ' . $user->last_name, 'email' => $user->email];
      }
      \Log::error($e, ['person' => $user_data]);
      parent::report($e);
    }
  }


  /**
   * Render an exception into an HTTP response.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Exception  $e
   * @return \Illuminate\Http\Response
   */
  public function render($request, Exception $e) {
    if(getEnv('APP_ENV', 'not_local') == 'local') return parent::render($request, $e);
    if($e instanceof TokenMismatchException)  { 
      return redirect('login')->withMessage('Your session has expired. Please try logging in again.'); 
    }
    else if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
      return response()->view('errors.404', [], 404);
    }
    else if ($e instanceof Illuminate\Auth\AuthenticationException){
      return redirect('login')->withMessage('Your session has expired. Please try logging in again.');
    }
    else if ($e instanceof \Illuminate\Database\QueryException)  { 
      return response()->view('errors.404', [], 404);
    }
    else if ($e instanceof Predis\Connection\ConnectionException){}
    return parent::render($request, $e);
  }


  protected function convertExceptionToResponse(Exception $e) {
    if(getEnv('APP_ENV', 'not_local') == 'local') return parent::convertExceptionToResponse($e);;
    if(!config('app.debug')) {
      $whoops = new \Whoops\Run;
      $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
      return response()->view('errors.404', [], 404);
    }
    return parent::convertExceptionToResponse($e);
  }
}