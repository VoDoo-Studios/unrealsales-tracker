import React from 'react';
import { connect } from 'react-redux';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { FaTrashAlt } from 'react-icons/fa';

import { setProcessingForm } from '../../actions/appActions';
import { removeProductFromList, getLists } from '../../actions/listsActions';
import { selectSelectedList } from '../../selectors/lists';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        removeProductFromList: (slug, listId) => dispatch(removeProductFromList(slug, listId)),
        getLists: () => dispatch(getLists()),
    }
}
const mapStateToProps = (state, ownProps) => {
    const isProcessing = (state.app.processing && state.app.processing.removingProduct) || false;
    const slug = ownProps.slug;
    const product = state.products[slug] || false;
    const selectedList = selectSelectedList(state);

    return {
        isProcessing,
        slug,
        product,
        selectedList,
    }
};

class RemoveProduct extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            removeConfirmation: false,
        };
    }

    showRemoveConfirmation(event) {
        event.preventDefault();
        event.stopPropagation();
        this.setState({
            removeConfirmation: !this.state.removeConfirmation
        })
    }

    async onRemove() {
        const { slug, selectedList, removeProductFromList, setProcessingForm, getLists } = this.props;
        setProcessingForm('removingProduct', true);
        await removeProductFromList(slug, selectedList);
        await getLists();
        window.gtag('event', 'tracker', {'type': 'delete', 'slug': slug})
        setProcessingForm('removingProduct', false);
    }

    render() {
        const { product, isProcessing } = this.props;
        return (
            <>
                <a
                    href="#remove"
                    className="product__remove"
                    onClick={this.showRemoveConfirmation.bind(this)}
                >
                    <FaTrashAlt size='2rem' color='#af1e1e'/>
                </a>
                <Modal show={this.state.removeConfirmation} onHide={this.showRemoveConfirmation.bind(this)}>
                    <Modal.Body>
                        <p>Do you want to remove <b>{product.title}</b> from your tracking list?.</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.showRemoveConfirmation.bind(this)}>Cancel</Button>
                        <Button variant="danger" onClick={this.onRemove.bind(this)} disabled={isProcessing}>
                            {isProcessing &&
                                <Spinner animation="grow" size="sm" variant="warning"/>
                            }
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }

}

export default RemoveProduct = connect(mapStateToProps, mapDispatchToProps)(RemoveProduct);
