import React , { Component } from 'react';
import {
	Container,
	Form,
	ListGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
	faPlus,
	faMinusCircle,
	faTrash,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons'
import VirtualList from 'react-virtual-list';
import TimePicker from 'react-bootstrap-time-picker';
import axios from 'axios'

import AddRestaurantModal from './AddRestaurantModal'

const SECONDS_IN_DAY = 24 * 60 * 60
const DAYS = ['Mon', 'Tue' , 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TEN_AM = 10 * 60 * 60 // Default starting filter time

export default class Restaurants extends Component {
  timer;

  state = {
    time: TEN_AM,
    searchedName: '',
    selectedDays: {},
    items: [],
    filteredRestaurants: [],

    showModal: false,
    modalTitle: '',
    modalId: '',
    modalCheckboxes: {},

    showShareModal: false,
    emailRecipients: [""],
    modalRestaurantCollection: {},
  }
  constructor(props){
  	super(props);
  	let selectedDays = {}
  	// Create an obj that holds all of the days with a corresponding checked value, default all to true
  	DAYS.forEach(day => selectedDays[day] = true )
  	this.state.selectedDays = selectedDays;

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


    axios.get('http://localhost:8080/api/GetRestaurantCollections',{
    	params: {
    		collectionIds: collectionIds
    	}
    })
    .then(response => {
      const { data } = response;
      this.setState({ myCollections:data })
    })
    .catch(function (error) {
      console.log(error);
    });

  }

	showModal = (restaurant) => {
		const {myCollections} = this.state
		const {_id, name} = restaurant;
		let modalCheckboxes = {}
		myCollections.forEach(collection => modalCheckboxes[collection._id] = false )
		this.setState({
			showModal: true,
			modalTitle: name,
			modalId: _id,
			modalCheckboxes
		},()=>{
			console.log(this.state);
		})
	}

	closeModal = () => {
		this.setState({
			showModal: false,
		})
	}

	MyList = ({ virtual, itemHeight}) => (
		<ListGroup style={virtual.style}>
        {
          virtual.items.map((item,index)=>{
            return( 
              <div key={index} style={{height:itemHeight, display:'flex',flexDirection:'row'}}>
              	<ListGroup horizontal style={{flex:1, marginBottom:'10px'}}>
	                <ListGroup.Item className={'list-item'}>{item.name}</ListGroup.Item>
	                <ListGroup.Item className={'list-item'}>{item.openingHours}</ListGroup.Item>
	                <ListGroup.Item 
	                	variant={'primary'} 
	                	style={{cursor:'pointer',display:'flex',justifyContent:'center',alignItems:'center',width:itemHeight}}
	                	onClick={()=>{this.showModal(item)}}
                	>
                			<FontAwesomeIcon style={{fontSize:'30px'}} icon={faPlus} />
	                </ListGroup.Item>
                </ListGroup>
              </div>
            )
          })
        }
      </ListGroup>
	);
	render(){
		const MyVirtualList = VirtualList()(this.MyList)
		return(
			<div>
	      <Container style={{paddingTop:'20px', paddingBottom:'20px'}}>
	      	<div>
					  <Form.Group controlId="formBasicName">
					    <Form.Label>Search</Form.Label>
					    <Form.Control onChange={this.filterName} placeholder="Restaurant Name" />
					  </Form.Group>
						<Form>
						    <div className="mb-3">
						    	{ DAYS.map((day,index) => (
						      	<Form.Check 
						      		checked={this.state.selectedDays[day]} 
						      		onChange={this.filterDay}
						      		key={`checkbox-${day}`} 
						      		data-day={day}
						      		inline 
						      		label={day} 
						      		type={'checkbox'} 
						      		id={`checkbox-${day}`} 
						      	/>
						      ))}
						    </div>
						</Form>
		        <TimePicker onChange={this.filterTime} value={this.state.time} start="00:00" end="23:59" step={30} />
	        </div>
	        <h3 style={{marginTop:'20px', marginBottom:'20px', textAlign:'center'}}> Restaurants </h3>
					<MyVirtualList
					  items={this.state.filteredRestaurants}
					  itemHeight={85}
					/>
	      </Container>
      	<AddRestaurantModal
      		showModal={this.state.showModal}
      		modalTitle={this.state.modalTitle}
      		modalId={this.state.modalId}
      		closeModal={this.closeModal}
      	/>
      </div>
		)
	}
}