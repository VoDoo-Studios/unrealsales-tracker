import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import { NavDropdown, Form } from 'react-bootstrap';
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
    const tags = [...new Set(Object.keys(state.products).flatMap((product) => {
        return state.products[product].tags.map((tag) => tag.name);
    }))];
    const formattedTags = tags.map((tag) => { return {label: '+' + tag.toLowerCase(), value: tag}});

    return {
        tags,
        formattedTags,
        filters: state.app.filters || false,
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
                        selectAll: "Select All",
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