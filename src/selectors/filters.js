const slicer = state => state.app?.filters ?? {};

export const selectFilters = state =>  slicer(state);
export const selectFilteredFilters = (state, excludeFilter) => Object.keys(slicer(state)).filter((filter) => filter !== excludeFilter)
    // eslint-disable-next-line no-sequences
    .reduce( (res, key) => (res[key] = slicer(state)[key], res), {} );





// Filter out products that had been already filtered by other filters
// const filteredProducts = Object.keys(state.products).filter((product) => {
//     let filtered = false;
//     Object.keys(filteredFilters).map((filter) => {
//         if (!matchObject(state.products[product], filteredFilters[filter])) filtered = true;
//     })
//     return !filtered;
// }).reduce( (res, key) => (res[key] = state.products[key], res), {} );

// // Retrieve tags from already filtered products
// const tags = [...new Set(Object.keys(filteredProducts).flatMap((product) => {
//     return filteredProducts[product].hasOwnProperty('tags') ? filteredProducts[product].tags.map((tag) => {         
//         return tag.name;
//     }) : [];
// }))];

// // Transform tags to pass down to Multiselect as options
// const formattedTags = (tags && tags.map((tag) => { return {label: '-' + tag.toLowerCase(), value: tag}})) || [];

// let selectedTagFilters = filters && filters.excludeTagFilter && filters.excludeTagFilter['tags.name'] || [];
// selectedTagFilters = selectedTagFilters.filter((tag) => {
//     return tags.includes(tag);
// })

// return {
//     formattedTags,
//     filters,
//     selectedTagFilters
// }