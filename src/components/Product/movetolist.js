import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Dropdown, Spinner } from 'react-bootstrap';

import { setProcessingForm } from '../../actions/appActions';
import { removeProductFromList, getLists, addProductToList } from '../../actions/listsActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        removeProductFromList: (slug, listId) => dispatch(removeProductFromList(slug, listId)),
        getLists: () => dispatch(getLists()),
        addProductToList: (slug, listId) => dispatch(addProductToList(slug, listId)),
    }
}
const mapStateToProps = (state, ownProps) => {
    const isProcessing = (state.app.processing && state.app.processing.movingProduct) || false;
    const slug = ownProps.slug;
    const product = state.products[slug] || false;
    const selectedList = selectSelectedList(state);
    const list = selectList(state, selectedList);
    const lists = selectLists(state);

    return {
        isProcessing,
        slug,
        product,
        selectedList,
        list,
        lists,
    }
};

class MoveToList extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            moveConfirmation: false,
        };
    }

    showMoveConfirmation(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            moveConfirmation: !this.state.moveConfirmation
        })
    }

    async onMove(listId) {
        const { slug, selectedList, removeProductFromList, getLists, addProductToList, setProcessingForm } = this.props;
        setProcessingForm('movingProduct', true);
        await removeProductFromList(slug, selectedList);
        await addProductToList(slug, listId);
        await getLists();
        window.gtag('event', 'tracker', { 'type': 'move', 'slug': slug });
        setProcessingForm('movingProduct', false);
        this.setState({
            moveConfirmation: false,
        });
    }

    render() {
        const { product, list, lists, isProcessing } = this.props;
        return (
            <>
                <a
                    href="#move"
                    className="product__move"
                    onClick={this.showMoveConfirmation.bind(this)}
                >
                    Move to list
                </a>
                <Modal show={this.state.moveConfirmation} onHide={this.showMoveConfirmation.bind(this)}>
                    <Modal.Body>
                        <p>Where should I move <b>{product.title}</b>?.</p>
                        <Dropdown onSelect={this.onMove.bind(this)} className="list-selector" disabled={isProcessing}>
                            <Dropdown.Toggle variant="primary">
                                {isProcessing &&
                                    <Spinner animation="grow" size="sm" variant="warning" />
                                }
                                {list.listName}
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {
                                    Object.keys(lists).map((key) => {
                                        if(lists[key].listId === list.listId) return false;
                                        return (<Dropdown.Item key={lists[key].listId} eventKey={lists[key].listId}>{lists[key].listName}</Dropdown.Item>);
                                    })
                                }
                            </Dropdown.Menu>
                        </Dropdown>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.showMoveConfirmation.bind(this)}>Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}

export default MoveToList = connect(mapStateToProps, mapDispatchToProps)(MoveToList);
