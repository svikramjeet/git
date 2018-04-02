<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class userAgeRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        return $value > 18;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        //return 'Age must be greater than :attribute , you are just :value years old ;)';
        return ':attribute must be greater than 18';
    }
}
