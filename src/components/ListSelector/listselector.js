import React from 'react';
import { connect } from 'react-redux';
import { Dropdown } from 'react-bootstrap';
import { setSelectedList, setProcessingForm } from '../../actions/appActions';
import { getLists } from '../../actions/listsActions';
import { selectLists, selectSelectedList, selectList } from '../../selectors/lists';
import './listselector.css';

const mapStateToProps = (state) => {
    const lists = selectLists(state);
    const selectedList = selectSelectedList(state);
    const list = selectList(state, selectedList);
    return {
        lists,
        selectedList,
        list
    }
};
const mapDispatchToProps = (dispatch) => {
    return {
        getLists: () => dispatch(getLists()),
        setSelectedList: (listId) => {
            dispatch(setSelectedList(listId));
        },
        setProcessingForm: (form, value) => dispatch(setProcessingForm(form, value)),
    };
};

class ListSelector extends React.PureComponent {
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
    componentDidUpdate() {
        const { lists, selectedList, setSelectedList } = this.props;
        if (!selectedList && Object.keys(lists).length > 0) setSelectedList(lists[0].listId);
    }
    onSelect(eventKey) {
        const { setSelectedList } = this.props;
        setSelectedList(eventKey);
    }
    render() {
        const { lists, list } = this.props;
        return (
            <div>
                <Dropdown onSelect={this.onSelect.bind(this)}>
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
            </div>
        )
    }
}

export default ListSelector = connect(mapStateToProps, mapDispatchToProps)(ListSelector);
