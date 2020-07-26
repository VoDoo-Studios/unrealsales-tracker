import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Badge } from 'react-bootstrap';
import { getLists } from '../../actions/listsActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';
import './listmanager.css';

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
        getLists: () => dispatch(getLists()),
    };
};

class ListManager extends React.PureComponent {
    render() {
        const { onManagerToggle, showManager, lists } = this.props;
        return (
            <Modal show={showManager} onHide={onManagerToggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Manage lists</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(lists).map((listKey) => {
                            return (
                                <p className="list-manager__item">
                                    {lists[listKey].listName}
                                    <Badge variant="info">{lists[listKey].items.length}</Badge>
                                </p>
                            )
                        })
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onManagerToggle}>
                        Close
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

export default ListManager = connect(mapStateToProps, mapDispatchToProps)(ListManager);
