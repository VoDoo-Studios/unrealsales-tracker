import React from 'react';
import { connect } from 'react-redux';
import { Spinner, Card, Button, Badge } from 'react-bootstrap';
import ReadMoreReact from 'read-more-react';

import { setProcessingForm } from '../../actions/appActions';
import { getProduct } from '../../actions/productsActions';

import './product.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        getProduct: (slug) => dispatch(getProduct(slug)),
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
        const { getProduct, slug, product } = this.props;
        try {
            console.log(product);
            if (Object.keys(product).length === 0) {
                await getProduct(slug);
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
        console.log(product, "#" + this.stringToColour(product.categories[0].name));
        return (
            <Card style={{ maxWidth: '17rem' }} className="product">
                <Card.Img variant="top" src={product.thumbnail} />
                <Card.Body>
                    <Badge variant="secondary"> {product.price} </Badge>
                    <Badge variant="info" className="product__category" style={{ 
                            backgroundColor: this.stringToColour(product.categories[0].name)
                        }}>
                        {product.categories[0].name}
                    </Badge>
                    <Card.Title>{product.title}</Card.Title>
                    <Card.Text>
                        <ReadMoreReact text={product.description}
                            min={70}
                            ideal={90}
                            max={110}
                            readMoreText="See more"/>
                    </Card.Text>
                    <Button target="_blank" href={'https://www.unrealengine.com/marketplace/en-US/slug/' + slug} variant="primary">Visit store page</Button>
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
