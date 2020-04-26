import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import MultiSelect from "@khanacademy/react-multi-select";

import { setFilters } from '../../actions/appActions';
import { selectFilters, selectFilteredFilters } from '../../selectors/filters';
import { selectFilteredProducts } from '../../selectors/products';


const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const filters = selectFilters(state);

    // Retrieve all filters except the current one
    let filteredFilters = selectFilteredFilters(state, 'excludeTagFilter');

    // Filter out products that had been already filtered by other filters
    const filteredProducts = selectFilteredProducts(state, filteredFilters);

    // Retrieve tags from already filtered products
    const tags = [...new Set(Object.keys(filteredProducts).flatMap((product) => {
        return filteredProducts[product].hasOwnProperty('tags') ? filteredProducts[product].tags.map((tag) => {         
            return tag.name;
        }) : [];
    }))];

    // Transform tags to pass down to Multiselect as options
    const formattedTags = (tags && tags.map((tag) => { return {label: '-' + tag.toLowerCase(), value: tag}})) || [];

    let selectedTagFilters = (filters && filters.excludeTagFilter && filters.excludeTagFilter['tags.name']) || [];
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