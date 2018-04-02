<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Rules\userAgeRule;
use App\Model\User;
use App\Scope\IsAdminScope;
use Illuminate\Support\Carbon;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::grey()->get();
        //return view('home');




    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('adduser');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
                
        // $this->validate(request(), [
        //  'age' => [new userAgeRule]
        //  ]);
        // $this->validate(request(), [
        //     'age' => [function ($attribute, $value, $fail) {
        //     if ($value <= 18) {
        //         $fail(':attribute must be greater than 20');
        //         }
        //     }]
        // ]);
        // $validator = $this->validate($request, [
        //     'first_name' => 'required',
        //     'email' => 'required|email',
        //     'password' => 'required|min:2'
        //     ]);

        $input = $request->all();
        $input['created_at'] = Carbon::now();
        $airport = User::create($input);
        return redirect('/user')->with('success', 'Saved Successfully !');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //









    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //



























    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //



























    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //



























    }
}
