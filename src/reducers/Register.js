const register = (state = {}, data) => {
    switch (data.type) {
        case 'SET_REGISTER_FORM':
            return {
                ...state,
                form: {
                    ...state.form,
                    ...data.form,
                },
            }
        case 'CLEAR_REGISTRATION_FORM':
            return {
                ...state,
                form: {},
            }
        case 'SET_LOGIN_FORM':
            return {
                ...state,
                loginForm: {
                    ...state.loginForm,
                    ...data.form
                }
            }
        case 'SET_RESET_FORM':
            return {
                ...state,
                resetForm: {
                    ...state.resetForm,
                    ...data.form
                }
            }
        case 'SET_CHANGEPASSWORD_FORM':
            return {
                ...state,
                changePasswordForm: {
                    ...state.changePasswordForm,
                    ...data.form
                }
            }
        case 'CLEAR_LOGIN_FORM':
            return {
                ...state,
                loginForm: {}
            }
        default:
            return state;
    }
};

export default register;
