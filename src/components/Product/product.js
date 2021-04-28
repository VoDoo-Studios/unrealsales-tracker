import React from 'react';
import { connect } from 'react-redux';
import { Card, Badge } from 'react-bootstrap';
import { matchObject } from 'searchjs';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ReadMoreReact from 'read-more-react';
import RemoveProduct from './removeproduct';
import MoveToList from './movetolist';
import stringToColor from '../../modules/strToColor';
import { selectCurrency, selectCurrencyRate } from '../../selectors/currency';

import { setProcessingForm } from '../../actions/appActions';
import { postProduct, setProduct } from '../../actions/productsActions';

import './product.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        getProduct: (slug) => dispatch(postProduct(slug)),
        setProduct: (slug, productData) => dispatch(setProduct(slug, productData)),
    }
}
const mapStateToProps = (state, ownProps) => {
    const isProcessing = (state.app.processing && state.app.processing.retrieveLists) || false;
    const slug = ownProps.slug;
    const product = state.products[slug] || false;
    const filters = state.app.filters || {};
    const currency = selectCurrency(state);
    const currencyRate = selectCurrencyRate(state, currency);
    return {
        isProcessing,
        slug,
        product,
        filters,
        currency,
        currencyRate,
    }
};

class Product extends React.PureComponent {
    async componentDidMount() {
        const { getProduct, setProduct, slug, product } = this.props;
        try {
            if (Object.keys(product).length === 0) {
                let productData = await getProduct(slug);
                if (productData.title) {
                    setProduct(slug, productData)
                }
            }
        } catch(e) {
            console.error(e);
        }
    }
  
    render() {
        const { product, slug, filters } = this.props;

        if (!product) {
            return (
                <Card style={{ maxWidth: '15rem', minHeight: '30rem' }}>
                </Card>
            )
        }

        if (filters) {
            let filtered = false;
            Object.keys(filters).map((filter) => {
                if (!matchObject(product, filters[filter])) filtered = true;
                return true;
            })
            if (filtered) {
                return null;
            }
        }
        return (
            <Card className="product">
                <div className="product__image-container">
                    <Card.Img variant="top" src={product.thumbnail} />
                    <div className="product__image-overlay">
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {window.gtag('event', 'tracker', {'type': 'visit_product', 'slug': slug});}}
                            href={'https://www.unrealengine.com/marketplace/en-US/product/' + slug}
                        >
                            <FaExternalLinkAlt size='2rem'/>
                        </a>
                        <RemoveProduct slug={slug}/>
                        <MoveToList slug={slug}/>
                    </div>
                    <div className="product__image-badgeoverlay">
                        {product.discounted &&
                            <Badge variant="success" className="product__image-onsalebadge">
                                On Sale! {100 - product.discountPercentage}% off 
                            </Badge>
                        }
                    </div>
                </div>

                <Card.Body>
                    <div className="product__badges">
                        <Badge variant="secondary"> {this.convertPrice(product.priceValue)} </Badge>
                        {product.discounted &&
                            <Badge variant="danger"> {this.convertPrice(product.discountPriceValue)} </Badge>
                        }
                        {product.categories && product.categories.length > 0 &&
                            <Badge variant="info" className="product__category" style={{ 
                                    backgroundColor: stringToColor(product.categories[0].name)
                                }}>
                                {product.categories[0].name}
                            </Badge>
                        }
                    </div>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text as="div">
                        <ReadMoreReact text={product.description}
                            readMoreText="See more"/>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    convertPrice(price) {
       
        const { product, currency, currencyRate } = this.props;
        
        let formattedCurrencyCode = currency;
        if (currency === 'EUR') formattedCurrencyCode = '€';
        if (currency === 'USD') {
            formattedCurrencyCode = '$';
        }
        if (currency === 'GBP') {
            formattedCurrencyCode = '£';
        }
        if (currency === 'RUB') {
            formattedCurrencyCode = '₽';
        }
        let newPrice = (price / 100);

        if (!currencyRate || currency === product.currencyCode) return formattedCurrencyCode + price / 100;
        return formattedCurrencyCode + (newPrice / currencyRate[product.currencyCode]).toFixed(2);
    }
}

export default Product = connect(mapStateToProps, mapDispatchToProps)(Product);
