import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import IncludeTagsFilter from './includeTagsFilter';
import stringToColor from '../../modules/strToColor';

import { setFilters } from '../../actions/appActions';

import './filters.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const categories = [...new Set(Object.keys(state.products).map((product) => {
        return state.products[product].categories[0].name;
    }))];
    return {
        categories,
        filters: state.app.filters,
    }
};

class Filters extends PureComponent {
    FILTER_BY_CATEGORY = 'BY_CATEGORY';

    render() {
        const { filters, categories, tags } = this.props;
        return (
            <Navbar bg="dark" expand="lg" variant="dark" className="filters">
                <Navbar.Toggle aria-controls="filter-selector" />
                <Navbar.Collapse id="filter-selector">
                    <Nav
                        className="filters__filterbar"
                    >
                        <h5>Filters</h5>
                        <NavDropdown 
                            title={filters && filters.hasOwnProperty('categories.name') ? filters['categories.name'] : 'by category'} 
                            onSelect={this.handleSaveFilter.bind(this, this.FILTER_BY_CATEGORY)}
                            className="filters__filterbar-category">
                            <NavDropdown.Header>Filter by category</NavDropdown.Header>
                            <NavDropdown.Item key="clear" eventKey="clear">Clear</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            {categories.map(cat => {
                                return (
                                    <NavDropdown.Item key={cat} eventKey={cat} style={{backgroundColor: stringToColor(cat)}}>
                                        {cat}
                                    </NavDropdown.Item>
                                )
                            })}
                        </NavDropdown>
                        <IncludeTagsFilter/>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

    handleSaveFilter(filter, selection) {
        const { setFilters, filters } = this.props;
        switch (filter) {
            case this.FILTER_BY_CATEGORY:
                let newFilters = {
                    ...filters,
                    'categories.name': selection,
                }
                if (selection === 'clear') delete newFilters['categories.name'];
                setFilters(newFilters);
                break;

            default:
                break;
        }
    }
}

export default Filters = connect(mapStateToProps, mapDispatchToProps)(Filters);