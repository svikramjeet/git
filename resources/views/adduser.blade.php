@extends('layouts.landing')

@section('pagetitle')
Dashboard
@endsection

@section('pagecontent')
<form id="signup" name="signup" action="{{ url('/user') }}" method="post">
{!! csrf_field() !!}

	<label for="First Name">First Name</label>
	<input class="text" name="first_name" type="text" /><br/>
    @if ($errors->has('first_name'))
        <span class="help-block first_name-error" style="color:red;">
            {{ $errors->first('first_name') }}
        </span>
    @endif    
	<label for="username">Last Name</label>
	<input class="text lastname" name="last_name" type="text" /><br/>
    <label for="email">Email Address</label>
	<input class="text" name="email" type="text" /><br/>
    @if ($errors->has('email'))
        <span class="help-block email-error" style="color:red;">
            {{ $errors->first('email') }}
        </span>
    @endif    
	<label for="phone">Phone Number</label>
	<input class="text phone" name="phone" type="text" /><br/>
	<label for="password">Password</label>
	<input class="text password" name="password" type="password" /><br/>
    @if ($errors->has('password'))
        <span class="help-block password-error" style="color:red;">
            {{ $errors->first('password') }}
        </span>
    @endif    
    <label for="age">age</label>
	<input class="text age" name="age" type="text" /><br/>
    @if ($errors->has('age'))
        <span class="help-block age-error" style="color:red;">
            {{ $errors->first('age') }}
        </span>
    @endif
	<input class="btn" type="submit" value="Sign Up" />
</form>
@endsection
