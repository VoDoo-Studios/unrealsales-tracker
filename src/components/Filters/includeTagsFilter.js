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
    let filteredFilters = selectFilteredFilters(state, 'tagFilter');

    // Filter out products that had been already filtered by other filters
    const filteredProducts = selectFilteredProducts(state, filteredFilters);

    // Retrieve tags from already filtered products
    const tags = [...new Set(Object.keys(filteredProducts).flatMap((product) => {
        return filteredProducts[product].hasOwnProperty('tags') ? filteredProducts[product].tags.map((tag) => {         
            return tag.name;
        }) : [];
    }))];

    // Transform tags to pass down to Multiselect as options
    const formattedTags = (tags && tags.map((tag) => { return {label: '+' + tag.toLowerCase(), value: tag}})) || [];

    let selectedTagFilters = filters && filters.tagFilter && filters.tagFilter['tags.name'] || tags;
    selectedTagFilters = selectedTagFilters.filter((tag) => {
        return tags.includes(tag);
    })

    return {
        formattedTags,
        filters,
        selectedTagFilters
    }
};

class IncludeTagsFilter extends PureComponent {

    render() {
        const { selectedTagFilters, formattedTags } = this.props;

        return (
            <div className="filters__filterbar-includetags">
                <MultiSelect
                    options={formattedTags}
                    selected={selectedTagFilters}
                    onSelectedChanged={this.handleSaveFilter.bind(this)}
                    overrideStrings={{
                        selectSomeItems: "all tags are excluded",
                        allItemsAreSelected: "all tags are included",
                        selectAll: "Include all",
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
            tagFilter: {
                'tags.name': filter,
            }
        }
        setFilters(newFilters);
    }
}

export default IncludeTagsFilter = connect(mapStateToProps, mapDispatchToProps)(IncludeTagsFilter);