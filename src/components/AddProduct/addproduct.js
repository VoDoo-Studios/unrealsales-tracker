import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Collapse, InputGroup, FormControl, Button, Spinner } from 'react-bootstrap';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

import { setProcessingForm } from '../../actions/appActions';
import { addProductToList, getLists } from '../../actions/listsActions';
import { postProduct, setProduct } from '../../actions/productsActions';

import './addproduct.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        addProduct: (slug) => dispatch(postProduct(slug)),
        setProduct: (slug, productData) => dispatch(setProduct(slug, productData)),
        addProductToList: (slug, list) => dispatch(addProductToList(slug, list)),
        getLists: () => dispatch(getLists()),
    }
}
const mapStateToProps = (state) => {
    const isProcessing = (state.app.processing && state.app.processing.addingProduct) || false;
    const listId = (state.lists && Object.keys(state.lists).length > 0 && state.lists[0].listId) || false;

    return {
        isProcessing,
        listId,
    };
};
class AddProduct extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            showAddProduct: JSON.parse(localStorage.getItem('addproduct_state')) || false,
            newSlug: '',
            invalidLink: false,
        }
    }
    onUpdateNewSlug(e) {
        this.setState({
            newSlug: e.target.value,
            invalidLink: false,
        });
    }
    onShowClick(e) {
        e.preventDefault();
        e.stopPropagation();
        localStorage.setItem('addproduct_state', !this.state.showAddProduct);
        this.setState({
            showAddProduct: !this.state.showAddProduct,
        })
    }
    async onSave() {
        const { addProduct, setProduct, addProductToList, getLists, listId, setProcessingForm } = this.props;
        let regex = /^https:\/\/(www\.|)unrealengine\.com\/marketplace\/(.*)\/slug\/([a-z0-9-]+)(\/|)$/i;
        let slugMatches = this.state.newSlug.match(regex);
        if (!slugMatches) {
            return this.setState({
                invalidLink: true,
            });
        }
        setProcessingForm('addingProduct', true);
        let slug = slugMatches[3]
        let productData = await addProduct(slug);
        await addProductToList(slug, listId);
        setProduct(slug, productData);
        await getLists();

        window.gtag('event', 'add_product', {'method': 'form'});
        setProcessingForm('addingProduct', false);
        this.setState({
            newSlug:'',
        });

    }
    
    render() {
        const { isProcessing } = this.props;

        return (
                <Row className="addproduct">
                    <Col md={12} className="addproduct__trigger-container">
                        <a 
                            className="addproduct__trigger"
                            href="" 
                            onClick={this.onShowClick.bind(this)}
                            aria-controls="addproduct-collapse"
                            aria-expanded={this.state.showAddProduct}>
                                {this.state.showAddProduct &&
                                    <FaMinusCircle/>
                                }
                                {!this.state.showAddProduct &&
                                    <FaPlusCircle/>
                                }
                                <span>Add product</span>

                        </a>
                        <small>
                            or drag this link 
                            (<a href={this.constructAddLink()}>Add to Wishlist</a>) 
                            to you Bookmarks bar and press it when you're on a UE4 marketplace product page
                        </small>
                    </Col>
                    <Col md={12}>
                        <Collapse in={this.state.showAddProduct}>
                            <div id="addproduct-collapse">
                                <InputGroup className="mt-3">
                                    <FormControl
                                        onChange={this.onUpdateNewSlug.bind(this)}
                                        value={this.state.newSlug}
                                        placeholder="https://www.unrealengine.com/marketplace/en-US/slug/modular-temple-plaza-4k-pbr"
                                        aria-label="https://www.unrealengine.com/marketplace/en-US/slug/modular-temple-plaza-4k-pbr"
                                        aria-describedby="basic-addon2"
                                        isInvalid={this.state.invalidLink}
                                    />
                                    <InputGroup.Append>
                                        <Button
                                            onClick={this.onSave.bind(this)}
                                            variant="outline-secondary"
                                            disabled={isProcessing}>
                                                {isProcessing &&
                                                    <Spinner animation="grow" size="sm" variant="warning"/>
                                                }
                                                Add to wishlist
                                        </Button>
                                    </InputGroup.Append>
                                    <FormControl.Feedback type="invalid">
                                        Link to product is invalid, here how a valid link looks https://www.unrealengine.com/marketplace/en-US/slug/modular-temple-plaza-4k-pbr
                                    </FormControl.Feedback>
                                </InputGroup>
                            </div>
                        </Collapse>
                    </Col>
                </Row>
        )
    }
    constructAddLink() {
        let href = window.location.href;
        let link = href + (href.substring(href.length-1) === '/' ? '' : '/') + 'add?product=';
        return 'javascript:(function(){if(window.location.href.indexOf("localhost")!==-1)return;f="' + link + '"+window.location.href;location.href=f;})()'
    }
}

export default AddProduct = connect(mapStateToProps, mapDispatchToProps)(AddProduct);
