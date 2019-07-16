import React from 'react';
import { connect } from 'react-redux';
import { Spinner, CardColumns } from 'react-bootstrap';
import { getLists } from '../../actions/listsActions';
import { setProcessingForm } from '../../actions/appActions';

import Product from '../Product/product';

import './grid.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        getLists: () => dispatch(getLists()),
    }
}
const mapStateToProps = (state) => {
    const isProcessing = (state.app.processing && state.app.processing.retrieveLists) || false;
    const products = (state.lists && Object.keys(state.lists).length > 0 && state.lists[0].items) || false;
    const lists = state.lists || false;
    return {
        isProcessing,
        products,
        lists,
    }
};

class Grid extends React.PureComponent {
    async componentDidMount() {
        const { getLists, setProcessingForm, lists } = this.props;
        try {
            if (Object.keys(lists).length === 0) {
                setProcessingForm('retrieveLists', true);
                await getLists();
                setProcessingForm('retrieveLists', false);
            }
        } catch (e) {
            console.error(e);
            setProcessingForm('retrieveLists', false);
        }
    }

    render() {
        const { isProcessing, products } = this.props;
        if (isProcessing) {
            return (
                <div className="grid-loader">
                    <Spinner animation="border" size="sm" />
                    <Spinner animation="border" />
                    <Spinner animation="grow" size="sm" />
                    <Spinner animation="grow" />
                    <span className="sr-only">Loading...</span>
                </div>
            )
        }
        if (products.length === 1) {
            return (
                <div className="grid-noproducts">
                    <h5>
                        Looks like you haven't added anything to your list yet!
                    </h5>
                    <p>
                        Try adding something now either by using "Add product" at the top of this page or drag and drop this link into you Bookmarks
                        and press it when you are on a product page on Unreal Marketplace.
                    </p>
                </div>
            )
        }
        console.log(products, products.length);
        return (
            <CardColumns className="grid">
                {products.length > 1 && products.map((product) => {
                    if (product === 'empty') return null;
                    return (
                        <Product
                            key={product}
                            slug={product}
                        />
                    );
                })}
            </CardColumns>
        )
    }
}

export default Grid = connect(mapStateToProps, mapDispatchToProps)(Grid);
