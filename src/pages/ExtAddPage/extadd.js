import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getLists, addProductToList } from '../../actions/listsActions';
import { setProcessingForm } from '../../actions/appActions';
import { postProduct } from '../../actions/productsActions';

import Header from '../../components/Header/header';

import './extadd.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        getLists: () => dispatch(getLists()),
        addProduct: (slug) => dispatch(postProduct(slug)),
        addProductToList: (slug, list) => dispatch(addProductToList(slug, list)),
    }
}

const mapStateToProps = (state) => {
    const userToken = state.app.userToken;
    const listId = (state.lists && Object.keys(state.lists).length > 0 && state.lists[0].listId) || false;

    return {
        userToken,
        listId,
    };
};

class ExtAdd extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            invalidLink: false,
            slug: false,
            url: false,
        }
    }
    componentDidMount() {
        const { userToken, listId, getLists } = this.props;
        const  { slug, url } = this.getUrlParameter('product');
        if (!slug || !url) {
            this.setState({
                invalidLink: true,
            });
            return;
        }

        if (!userToken) {
            return window.tracker.appHistory.push('/tracker/login/?product=' + url);
        }

        if (!listId) {
            getLists();
        }

        this.setState({
            invalidLink: false,
            url: url,
            slug: slug,
        })
    }
    async componentDidUpdate(prevProps) {
        const { listId, addProduct, addProductToList } = this.props;
        const { slug, url } = this.state;

        if (listId !== prevProps.listId) {
            await addProduct(slug);
            await addProductToList(slug, listId);
            window.gtag('event', 'add_product', {'method': 'external'});
            window.location = url;
        }
    }
    render() {
        const { userToken } = this.props;
        const { slug, url, invalidLink } = this.state;
        if (!userToken) {
            return null;
        }
        return (
            <Container  className="extadd-page">
                <Header/>
                {invalidLink &&
                    <Row>
                        <Col md={12} className="extadd-page__text">
                            <h5>
                                There's a problem with your link, please add the product manually.
                            </h5>
                        </Col>
                    </Row>
                }
                {slug && url &&
                    <Row>
                        <Col md={12} className="extadd-page__text">
                            <h5>
                                We're adding the product in your list ({slug})&nbsp; 
                                <small>
                                    and redirect you back to <a href={url}>{url}</a> once complete!
                                </small>
                            </h5>
                            <div className="grid-loader">
                                <Spinner animation="border" size="sm" />
                                <Spinner animation="border" />
                                <Spinner animation="grow" size="sm" />
                                <Spinner animation="grow" />
                                <span className="sr-only">Loading...</span>
                            </div>
                        </Col>
                    </Row>
                }
            </Container>
        )
    }
    getUrlParameter(name) {
        let response = {
            slug: '',
            url: '',
        };
    
        name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        let results = regex.exec(window.location.search);
        response.url = results && results.length > 0 ? decodeURIComponent(results[1].replace(/\+/g, ' ')) : '';
    
        let slugRegex = /^https:\/\/(www\.|)unrealengine\.com\/marketplace\/(.*)\/(slug|product)\/([a-z0-9-]+)(\/|)/i;
        let slugMatches = response.url.match(slugRegex);
        if (slugMatches) response.slug = slugMatches[4];

        return response;
    };
}

export default ExtAdd = connect(mapStateToProps, mapDispatchToProps)(ExtAdd);
