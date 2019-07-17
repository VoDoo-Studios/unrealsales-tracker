export const addProductToList = (slug, listId) => {
    return async (dispatch, getState) => {
        return fetch(window.tracker.api_endpoint + 'lists/products', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
            body: JSON.stringify({
                slug: slug,
                listId: listId
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw response;
        })
    }
}
export const removeProductFromList = (slug, listId) => {
    return async (dispatch, getState) => {
        return fetch(window.tracker.api_endpoint + 'lists/products', {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
            body: JSON.stringify({
                slug: slug,
                listId: listId
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw response;
        })
    }
}
export const getLists = () => {
    return (dispatch, getState) => {
        return fetch(window.tracker.api_endpoint + 'lists', {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            if (response.Count > 0) {
                return dispatch(setLists(response.Items));
            }
            throw response;
        })
    }
}
export const setLists = (lists) => {
    return {
        type: 'SET_LISTS',
        lists,
    }
}