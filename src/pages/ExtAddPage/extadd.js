import React from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { getLists, addProductToList } from '../../actions/listsActions';
import { setProcessingForm, setSelectedList } from '../../actions/appActions';
import { postProduct } from '../../actions/productsActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';

import Header from '../../components/Header/header';

import './extadd.css';

const mapDispatchToProps = (dispatch) => {
    return {
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
        getLists: () => dispatch(getLists()),
        addProduct: (slug) => dispatch(postProduct(slug)),
        addProductToList: (slug, list) => dispatch(addProductToList(slug, list)),
        setSelectedList: (listId) => {
            dispatch(setSelectedList(listId));
        },
    }
}

const mapStateToProps = (state) => {
    const userToken = state.app.userToken;
    const listId = selectSelectedList(state);
    const list = selectList(state, listId);
    const lists = selectLists(state);

    return {
        userToken,
        listId,
        lists,
        list,
    };
};

class ExtAdd extends React.PureComponent {
    constructor() {
        super();
        this.state = {
            invalidLink: false,
            slug: false,
            url: false,
            added: false,
        }
    }
    async componentDidMount() {
        const { userToken, listId, getLists, lists } = this.props;
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
        if (!listId || Object.keys(lists).length === 0) {
           await getLists();
        }

        this.setState({
            invalidLink: false,
            url: url,
            slug: slug,
        })
    }
    async componentDidUpdate(prevProps) {
        const { lists, listId, addProduct, addProductToList, setSelectedList } = this.props;
        const { slug, url } = this.state;
        console.log(listId, lists, prevProps.listId, lists[0].listId);
        if (!listId && Object.keys(lists).length > 0) setSelectedList(lists[0].listId);

        if (!this.state.added && listId && slug) {
            await addProduct(slug);
            await addProductToList(slug, listId);
            this.setState({added: true});
            window.gtag('event', 'add_product', {'method': 'external'});
            window.location = url;
        }
    }
    render() {
        const { userToken, list } = this.props;
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
                                We're adding the product({slug}) to list {list.listName}&nbsp; 
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
