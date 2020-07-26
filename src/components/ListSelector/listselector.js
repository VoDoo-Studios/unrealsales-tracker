import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { setSelectedList } from '../../actions/appActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';
import './listselector.css';

const mapStateToProps = (state) => {
    const lists = selectLists(state);
    const selectedList = selectSelectedList(state);
    const list = selectList(state, selectedList);
    return {
        lists,
        selectedList,
        list
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedList: (listId) => {
            dispatch(setSelectedList(listId));
        }
    };
};

class ListSelector extends React.PureComponent {
    onSelect(eventKey) {
        const { setSelectedList } = this.props;
        setSelectedList(eventKey);
    }
    render() {
        const { lists, list } = this.props;
        return (
            <div>
                <Dropdown onSelect={this.onSelect.bind(this)}>
                    <Dropdown.Toggle variant="primary">
                        {list.listName}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                            Object.keys(lists).map((key) => {
                                return (<Dropdown.Item key={lists[key].listId} eventKey={lists[key].listId}>{lists[key].listName}</Dropdown.Item>);
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
}

export default ListSelector = connect(mapStateToProps, mapDispatchToProps)(ListSelector);
