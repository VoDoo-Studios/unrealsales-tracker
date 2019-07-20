import React from 'react';
import { connect } from 'react-redux';
import { Card, Badge } from 'react-bootstrap';
import { FaExternalLinkAlt } from 'react-icons/fa';
import ReadMoreReact from 'read-more-react';
import RemoveProduct from './removeproduct';

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
    return {
        isProcessing,
        slug,
        product,
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
        const { product, slug } = this.props
        if (!product) {
            return (
                <Card style={{ maxWidth: '17rem', minHeight: '30rem' }}>
                </Card>
            )
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
                </div>

                <Card.Body>
                    <Badge variant="secondary"> {product.price} </Badge>
                    <Badge variant="info" className="product__category" style={{ 
                            backgroundColor: this.stringToColour(product.categories[0].name)
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
    stringToColour(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let colour = '#';
        for (let i = 0; i < 3; i++) {
          let value = (hash >> (i * 8)) & 0xFF;
          colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
      }
}

export default Product = connect(mapStateToProps, mapDispatchToProps)(Product);
