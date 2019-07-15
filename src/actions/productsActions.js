export const getProduct = (slug) => {
    return (dispatch, getState) => {
        return fetch('https://api.unrealsales.io/dev/products', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + getState().app.userToken,
            },
            body: JSON.stringify({
                slug: slug,
            }),
        })
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw response;
        })
        .then((response) => {
            if (response.Count > 0) {
                return dispatch(setProduct(slug, response.Items[0]));
            }
            throw response;
        })
    }
}
export const setProduct = (slug, data) => {
    return {
        type: 'SET_PRODUCT',
        [slug]: {
            ...data,
        }
    }
}