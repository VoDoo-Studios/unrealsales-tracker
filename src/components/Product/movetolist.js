import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Spinner, Dropdown } from 'react-bootstrap';

import { setProcessingForm } from '../../actions/appActions';
import { removeProductFromList, getLists } from '../../actions/listsActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        removeProductFromList: (slug, listId) => dispatch(removeProductFromList(slug, listId)),
        getLists: () => dispatch(getLists()),
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

    async onMove() {
        const { slug, selectedList, removeProductFromList, setProcessingForm, getLists } = this.props;
        setProcessingForm('movingProduct', true);
        await removeProductFromList(slug, selectedList);
        await getLists();
        window.gtag('event', 'tracker', { 'type': 'move', 'slug': slug })
        setProcessingForm('movingProduct', false);
    }

    onSelect() {

    }

    render() {
        const { product, isProcessing, list, lists } = this.props;
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
                        <Dropdown onSelect={this.onSelect.bind(this)} className="list-selector">
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
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.showMoveConfirmation.bind(this)}>Cancel</Button>
                        <Button variant="primary" onClick={this.onMove.bind(this)} disabled={isProcessing}>
                            {isProcessing &&
                                <Spinner animation="grow" size="sm" variant="warning" />
                            }
                            Move
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}

export default MoveToList = connect(mapStateToProps, mapDispatchToProps)(MoveToList);
