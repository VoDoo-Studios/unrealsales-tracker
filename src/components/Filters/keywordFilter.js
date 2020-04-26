import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { InputGroup, FormControl, Button } from 'react-bootstrap';
import { FaBackspace } from 'react-icons/fa';

import { setFilters } from '../../actions/appActions';
import { selectFilters } from '../../selectors/filters';

const mapDispatchToProps = (dispatch) => {
    return {
        setFilters: (filters) => {
            dispatch(setFilters(filters));
        }
    };
};
const mapStateToProps = (state) => {
    const filters = selectFilters(state);

    return {
        filters,
    }
};

class KeywordFilter extends PureComponent {
    render() {
        const { filters } = this.props;

        return (
            <div className="keywordfilter">
                <InputGroup className="pl-3 pr-3 keywordfilter__searchinput">
                    <FormControl
                        defaultValue={filters.keywordFilter?.terms?.[0]?.terms?.[0]?.description ?? ''}
                        value={filters.keywordFilter?.terms?.[0]?.terms?.[0]?.description ?? ''}
                        placeholder="by keyword"
                        aria-label="by keyword"
                        aria-describedby="basic-addon2"
                        onChange={this.handleSaveFilter.bind(this)}
                    />
                    <InputGroup.Append>
                        <Button className="keywordfilter__clearbtn" variant="outline-secondary" onClick={this.handleClearFilter.bind(this)}>
                            <FaBackspace size={21} />
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </div>
        );
    }

    handleSaveFilter(selection) {
        const { setFilters, filters } = this.props;
        selection = selection.target.value;

        let newFilters = {
            ...filters,
            keywordFilter: {
                terms: [
                    { _join: 'OR', terms: [
                        { description: selection, _text: true },
                        { longDescription: selection, _text: true },
                        { technicalDetails: selection, _text: true },
                        { title: selection, _text: true }
                    ]},
                ],
            }
        }
        setFilters(newFilters);

    }

    handleClearFilter() {
        const { setFilters, filters } = this.props;

        let newFilters = {
            ...filters
        };
        delete newFilters.keywordFilter;
        setFilters(newFilters);
    }
}

export default KeywordFilter = connect(mapStateToProps, mapDispatchToProps)(KeywordFilter);