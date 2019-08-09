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
    const filters = state.app.filters || [];
    let filteredFilters = Object.keys(filters).filter((filter) => filter !== 'tags.name')
        .reduce( (res, key) => (res[key] = filters[key], res), {} );
    const filteredProducts = Object.keys(state.products).filter((product) => {
        if (filters && !matchObject(state.products[product], filteredFilters)) {
            return false;
        }
        return true;
    }).reduce( (res, key) => (res[key] = state.products[key], res), {} );

    const tags = [...new Set(Object.keys(filteredProducts).flatMap((product) => {
        return filteredProducts[product].hasOwnProperty('tags') ? filteredProducts[product].tags.map((tag) => {         
            return tag.name;
        }) : [];
    }))];
    const formattedTags = (tags && tags.map((tag) => { return {label: tag.toLowerCase(), value: tag}})) || [];

    return {
        tags,
        formattedTags,
        filters, 
    }
};

class IncludeTagsFilter extends PureComponent {

    render() {
        const { filters, tags, formattedTags } = this.props;

        return (
            <div className="filters__filterbar-includetags">
                <MultiSelect
                    options={formattedTags}
                    selected={filters['tags.name'] || tags}
                    onSelectedChanged={this.handleSaveFilter.bind(this)}
                    overrideStrings={{
                        selectSomeItems: "Include some tags...",
                        allItemsAreSelected: "All tags are included",
                        selectAll: "Include All",
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
            'tags.name': filter,
        }
        setFilters(newFilters);
    }
}

export default IncludeTagsFilter = connect(mapStateToProps, mapDispatchToProps)(IncludeTagsFilter);