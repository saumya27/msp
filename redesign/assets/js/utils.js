MSP.utils = {
    /** 
    * method calls format.
    * MSP.utils.url.from.bgImage()
    */
    "url" : {
        "from" : {
            "bgImage" : function(bgProp) {
                replace('url(', '').replace(')', '').replace(/\"/g, '').replace(/\'/g, '')
            }
        }
    }
    "value" : {
        "from" : {
            "price" : function(price) {
                return parseInt(price.replace(/\D/g, ""), 10);
            }
        }
    },
    "convert" : {
        "price" : {
            "to" : {
                "number" : function(price) {
                    return parseInt(price.replace(/\D/g, ""), 10);
                }
            }
        }
    },
    "validate" : {
        "_" : {
            "regex" : {
                "number" : '^\\d+$',
                "email" : '^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
            },
            "messages" : {
                "number" : "Please enter a valid number.",
            }
            "getResult" : function(type, value) {
                var result = {},
                    status = this._regex[type].test(value);
                result.status = status;
                if (status) result.message = this._messages[type]];
                return result;
            }
        },
        "text" : function (value, minLength, maxLength) {
            return this._.getResult("text", value);
        },
        "number" : function(value) {
            return this._.getResult("number", value);
        },
        "email" : function() {
            return this._.getResult("email", value);
        },
        /** MSP.utils.validate.form
        * "formData" argument format
        *   [{
        *       "type" : "email",     // required Argument
        *       "value" : "a@a.com",  // required Argument
        *       "errorNode" : $(".field_error_message") // optional Argument
        *   }, .....]
        */
        "form" : function(formData) {
            var isValid = true,
                check = this;

            $.each(formData, function(i, field) {
                var result = check[field.type](field.value);
                if (result.status === false) {
                    if (field.errorNode instanceof jQuery) {
                        field.errorNode.text(result.message);
                    } else {
                        alert(result.message);
                    }
                    isValid = false;
                }
            });
            return isValid;
        }
    }
}




