export const setRegisterForm = (form) => {
    return {
        type: 'SET_REGISTER_FORM',
        form,
    };
};
export const setLoginForm = (form) => {
    return {
        type: 'SET_LOGIN_FORM',
        form,
    };
};
export const setResetForm = (form) => {
    return {
        type: 'SET_RESET_FORM',
        form,
    };
};
export const setChangePasswordForm = (form) => {
    return {
        type: 'SET_CHANGEPASSWORD_FORM',
        form,
    };
};
export const clearLoginForm = () => {
    return {
        type: 'CLEAR_LOGIN_FORM',
    };
};
export const clearRegistrationForm = () => {
    return {
        type: 'CLEAR_REGISTRATION_FORM',
    };
};
export const loginUser = (formData) => {
    return () => {
        return fetch(window.tracker.api_endpoint + 'profile/login', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            if (!response) {
                throw response;
            }
    
            localStorage.setItem('userToken', response.userToken);
            return response;
        })
    }
}
export const registerUser = (formData) => {
    return () => {
        return fetch(window.tracker.api_endpoint + 'profile/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            return response;
        })
    }
}

export const resetPassword = (formData) => {
    return () => {
        return fetch(window.tracker.api_endpoint + '/profile/reset-password', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            return response;
        })
    }
}

export const changePassword = (formData) => {
    return () => {
        return fetch(window.tracker.api_endpoint + '/profile/change-password', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...formData,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.text()
            }
            throw response;
        })
        .then((response) => {
            return response;
        })
    }
}