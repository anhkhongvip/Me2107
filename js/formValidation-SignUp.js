Validator = (options) => {

    var selectorRules = {};
    validate = (inputElement, rule , event) => {
        var errorElement = inputElement.closest(options.parentCard).querySelector(options.errorSelector);
        var errorMessage //= rule.test(inputElement.value);
        var fRules = selectorRules[rule.selector];
        for (var i = 0; i < fRules.length; i++) {
            errorMessage = fRules[i](inputElement.value)
            if (errorMessage)  break;
              
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage;
            inputElement.closest(options.parentCard).classList.add('invalid');
            event.preventDefault();  
        }
        else {
            errorElement.innerText = '';
            inputElement.closest(options.parentCard).classList.remove('invalid');
        }
    }

    var formElement = document.querySelector(options.form);
    if (formElement) {
        formElement.onsubmit = (event) => {
            console.log(event);
            // event.preventDefault(); 
            options.rules.forEach((rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule, event);
            });
        }
        options.rules.forEach((rule) => {
            var inputElement = formElement.querySelector(rule.selector);
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }
            else {
                selectorRules[rule.selector] = [rule.test]
            }
            if (inputElement) {
                //Xử lý mỗi khi người dùng blur ra khỏi input
                inputElement.onblur = (event) => {
                    console.log(rule.selector);
                    validate(inputElement, rule, event);
                }
                //Xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = () => {
                    var errorElement = inputElement.closest(options.parentCard).querySelector(options.errorSelector);
                    errorElement.innerText = '';
                    inputElement.closest(options.parentCard).classList.remove('invalid');
                }
            }

        });
    }
}
//Định nghĩa rules
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : message || 'Vui lòng nhập trường này'
        }
    };
}
Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là email'
        }
    };
}
Validator.isPassword = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : message || `Mật khẩu tối thiểu phải từ ${min} ký tự trở lên`
        }
    };
}
Validator.isConfirm = (selector, getConfirm, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value == getConfirm() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}

