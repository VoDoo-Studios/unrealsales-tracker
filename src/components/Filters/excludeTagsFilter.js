import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { matchObject } from 'searchjs';
import MultiSelect from "@khanacademy/react-multi-select";

import { setFilters } from '../../actions/appActions';


const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const filters = state.app.filters || {};

    // Retrieve all filters except the current one
    let filteredFilters = Object.keys(filters).filter((filter) => filter !== 'excludeTagFilter')
        .reduce( (res, key) => (res[key] = filters[key], res), {} );

    // Filter out products that had been already filtered by other filters
    const filteredProducts = Object.keys(state.products).filter((product) => {
        let filtered = false;
        Object.keys(filteredFilters).map((filter) => {
            if (!matchObject(state.products[product], filteredFilters[filter])) filtered = true;
        })
        return !filtered;
    }).reduce( (res, key) => (res[key] = state.products[key], res), {} );

    // Retrieve tags from already filtered products
    const tags = [...new Set(Object.keys(filteredProducts).flatMap((product) => {
        return filteredProducts[product].hasOwnProperty('tags') ? filteredProducts[product].tags.map((tag) => {         
            return tag.name;
        }) : [];
    }))];

    // Transform tags to pass down to Multiselect as options
    const formattedTags = (tags && tags.map((tag) => { return {label: '-' + tag.toLowerCase(), value: tag}})) || [];

    let selectedTagFilters = filters && filters.excludeTagFilter && filters.excludeTagFilter['tags.name'] || [];
    selectedTagFilters = selectedTagFilters.filter((tag) => {
        return tags.includes(tag);
    })

    return {
        formattedTags,
        filters,
        selectedTagFilters
    }
};

class ExcludeTagsFilter extends PureComponent {

    render() {
        const { selectedTagFilters, formattedTags } = this.props;

        return (
            <div className="filters__filterbar-includetags">
                <MultiSelect
                    options={formattedTags}
                    selected={selectedTagFilters}
                    onSelectedChanged={this.handleSaveFilter.bind(this)}
                    overrideStrings={{
                        selectSomeItems: "no tags excluded",
                        allItemsAreSelected: "all tags are excluded",
                        selectAll: "Exclude all",
                        search: "Search",
                    }}
                />
            </div>
        );
    }

    handleSaveFilter(filter) {
        const { setFilters, filters } = this.props;
        let newFilters = {
            ...filters,
            excludeTagFilter: {
                '_not': true,
                'tags.name': filter,
            }
        }
        setFilters(newFilters);
    }
}

export default ExcludeTagsFilter = connect(mapStateToProps, mapDispatchToProps)(ExcludeTagsFilter);