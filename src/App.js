import React , { Component } from 'react'
import {
	ListGroup,
	InputGroup,
	Form,
	Container,
	Row,
	Col,
	Navbar,
	Nav,
	NavDropdown,
	Button,
	FormControl,
	Tabs,
	Tab,
	Card,
	Modal
} from 'react-bootstrap';
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
	faPlus,
	faMinusCircle,
	faTrash,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import 'bootstrap/dist/css/bootstrap.min.css';

import Collections from './components/Collections'
import Restaurants from './components/Restaurants'
import AddRestaurantModal from './components/AddRestaurantModal'
import ShareCollectionModal from './components/ShareCollectionModal'

// Redux
import { connect } from 'react-redux';
import {
	fetchCollections,
	createCollection,
} from './actions/collectionAction';

import socket from './socket.js'

class ListExampleBasic extends Component {
  state = {

    showShareModal: false,
    emailRecipients: [""],
    modalRestaurantCollection: {},
  }
  constructor(props){
  	super(props);

    axios.get('http://localhost:8080/api/GetData')
      .then(response => {
        const { data } = response;
        this.setState({
          items:data,
          filteredRestaurants:data
        })
      })
      .catch(function (error) {
        console.log(error);
      });

		const urlParams = new URLSearchParams(window.location.search);
		const invitedCollection = urlParams.get('invitedCollection'); 
    let collectionIds = localStorage.getItem('collectionIds') || "[]";
    if(invitedCollection){
    	collectionIds = JSON.parse(collectionIds);
    	if(!collectionIds.includes(invitedCollection)) collectionIds.push(invitedCollection);
    	collectionIds = JSON.stringify(collectionIds);
    	localStorage.setItem('collectionIds',collectionIds);
    }

    this.props.fetchCollections(collectionIds);
  }

  componentDidMount() {
    socket.emit('initialSubscription', JSON.parse(localStorage.getItem('collectionIds')));
  }

  render(){
    return(
    	<div>
				{/*<Tabs style={{paddingTop:'10px'}}transition={false} defaultActiveKey="home" id="uncontrolled-tab-example">*/}
				<Tabs style={{paddingTop:'10px'}}transition={false} defaultActiveKey="home">
				  <Tab title={<h3>Is it open?</h3>} disabled>
				  </Tab>
				  <Tab eventKey="home" title="Home">
				  	<Restaurants/>
				  </Tab>
				  <Tab eventKey="collections" title="Collections">
				  	<Collections/>
				  </Tab>
				</Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => ({
	
});

const mapDispatchToProps = dispatch => ({
	fetchCollections: (collectionIds) => {
		dispatch(fetchCollections(collectionIds))
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListExampleBasic);