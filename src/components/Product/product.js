import React from 'react';
import { connect } from 'react-redux';
import { Card, Badge } from 'react-bootstrap';
import { matchObject } from 'searchjs';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ReadMoreReact from 'read-more-react';
import RemoveProduct from './removeproduct';
import stringToColor from '../../modules/strToColor';

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
    return {
        isProcessing,
        slug,
        product,
        filters,
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
                <Card style={{ maxWidth: '17rem', minHeight: '30rem' }}>
                </Card>
            )
        }

        if (filters) {
            let filtered = false;
            Object.keys(filters).map((filter) => {
                if (!matchObject(product, filters[filter])) filtered = true;
            })
            if (filtered) {
                return null;
            }
        }
        return (
            <Card style={{ maxWidth: '17rem' }} className="product">
                <div className="product__image-container">
                    <Card.Img variant="top" src={product.thumbnail} />
                    <div className="product__image-overlay">
                        <a 
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {window.gtag('event', 'tracker', {'type': 'visit_product', 'slug': slug});}}
                            href={'https://www.unrealengine.com/marketplace/en-US/slug/' + slug}
                        >
                            <FaExternalLinkAlt size='2rem'/>
                        </a>
                        <RemoveProduct slug={slug}/>
                    </div>
                    <div className="product__image-badgeoverlay">
                        {product.discounted &&
                            <Badge variant="success" className="product__image-onsalebadge">
                                On Sale
                            </Badge>
                        }
                    </div>
                </div>

                <Card.Body>
                    <Badge variant="secondary"> {product.price} </Badge>
                    <Badge variant="info" className="product__category" style={{ 
                            backgroundColor: stringToColor(product.categories[0].name)
                        }}>
                        {product.categories[0].name}
                    </Badge>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text as="div">
                        <ReadMoreReact text={product.description}
                            readMoreText="See more"/>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }
}

export default Product = connect(mapStateToProps, mapDispatchToProps)(Product);
