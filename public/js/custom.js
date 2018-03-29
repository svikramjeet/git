var validatation_messages = {
    first_name: {
        required: "Please enter your first name"
    },
    last_name: {
        required: "Please enter your last name"
    },
    email: {
        required: "Please enter your email address",
        email: "Please enter a valid email address",
        regx: "Please enter a valid email address"
    }
};

var validation_rules = {
    first_name: {
        required: true
    },
    last_name: {
        required: true
    },
    email: {
        required: true,
        email: true,
        regx: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    }
}

$(function() {
    //Admin login details validations
    var validator = $("#subscribe_form").validate({
        errorElement: 'span',
        errorClass: 'error-msg',
        rules: {
            first_name: validation_rules.first_name,
            last_name: validation_rules.last_name,
            email: validation_rules.email,
        },

        messages: {
            first_name: validatation_messages.first_name,
            last_name: validatation_messages.last_name,
            email: validatation_messages.email
        }
    })

    $('.signup-form').on('click',function(){
        fbq('track', 'Lead');
        validator.resetForm();
    })
});