export const getUrlParameter = (name) => {
    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(window.location.search);
    return results && results.length > 0 ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : false;
};