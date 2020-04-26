import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dropdown, Row, Col, Container } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';
import OnSaleFilter from './onSaleFilter';

class AdvancedFilter extends PureComponent {
    render() {
        return (
            <Dropdown className="filters__filterbar-advancedfilter">
                <Dropdown.Toggle variant="link">
                    <FaFilter/>
                </Dropdown.Toggle>

                <Dropdown.Menu alignRight as={Container}>
                    <Row>
                        <Col md={12}>
                            <OnSaleFilter />
                        </Col>
                    </Row>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default AdvancedFilter = connect(null, null)(AdvancedFilter);