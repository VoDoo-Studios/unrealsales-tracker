import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Row, Col, Container } from 'react-bootstrap';
import { matchObject } from 'searchjs';
import { FaFilter } from 'react-icons/fa';

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
    let filteredFilters = Object.keys(filters).filter((filter) => filter !== 'categoryFilter')
        .reduce((res, key) => (res[key] = filters[key], res), {});

    // Filter out products that had been already filtered by other filters
    const filteredProducts = Object.keys(state.products).filter((product) => {
        let filtered = false;
        Object.keys(filteredFilters).map((filter) => {
            if (!matchObject(state.products[product], filteredFilters[filter])) filtered = true;
        })

        return !filtered;
    }).reduce((res, key) => (res[key] = state.products[key], res), {});

    // Retrieve categories from already filtered products
    const categories = [...new Set(Object.keys(filteredProducts).map((product) => {
        return filteredProducts[product].categories[0].name;
    }))];
    return {
        categories,
        filters,
    }
};

class AdvancedFilter extends PureComponent {
    render() {
        const { filters, categories } = this.props;
        return (
            <Dropdown className="filters__filterbar-advancedfilter">
                <Dropdown.Toggle variant="link">
                    <FaFilter/>
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight as={Container}>
                    <Row>
                        <Col md={12}>
                            dsafadsfdssdaf asdfdlskhf asdljnf adsjklf asdjklh fadsjklhf dskjhf dsakjhf dsakjhf adskjhf sdkjhf dskjhdf 
                        </Col>
                    </Row>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    handleSaveFilter(selection) {
        const { setFilters, filters } = this.props;

        let newFilters = {
            ...filters,
            categoryFilter: {
                'categories.name': selection,
            }
        }

        if (selection === 'clear') delete newFilters.categoryFilter;
        setFilters(newFilters);

    }
}

export default AdvancedFilter = connect(mapStateToProps, mapDispatchToProps)(AdvancedFilter);