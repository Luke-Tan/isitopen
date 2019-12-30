//Npm imports
import React , { Component } from 'react';
import {
	Container,
	Form,
	ListGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
	faPlus,
} from '@fortawesome/free-solid-svg-icons'
import VirtualList from 'react-virtual-list';
import TimePicker from 'react-bootstrap-time-picker';
import axios from 'axios'
//Redux
import { connect } from 'react-redux'
//Components
import AddRestaurantModal from './AddRestaurantModal'

const SECONDS_IN_DAY = 24 * 60 * 60
const DAYS = ['Mon', 'Tue' , 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TEN_AM = 10 * 60 * 60 // Default starting filter time

class Restaurants extends Component {
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
  }

  filterName = (event) => {
  	const {value} = event.target;
    clearTimeout(this.timer);
    this.timer = setTimeout(()=>{ 
      const searchedName = value;
      this.setState({searchedName},()=>{
      	this.filterRestaurants();
      })
    }, 300);
  }

  filterTime = time => {
    this.setState({ time }, ()=>{
    	this.filterRestaurants();
    })
  }

	filterDay = (event) => {
		const {selectedDays} = this.state;
		const {day} = event.target.dataset;
		const {checked} = event.target;
		this.setState({
			selectedDays: {
				...selectedDays,
				[day]: checked
			}
		}, () => {
			this.filterRestaurants();
		})
	}

	filterRestaurants = () =>{
	  let filteredRestaurants = []
	  let { items, searchedName, time, selectedDays} = this.state 
	  for (let i = 0; i < items.length; i++) {
	  	const name = items[i]['name'].toLowerCase();
	  	let timeFound = false;
	  	for(let day in selectedDays){
	  		// First filter by the selected day(s)
	  		if(selectedDays[day]){
		  		let {start, end} = items[i]['time'][day.toLowerCase()];
			  	// If the end is less than the start, we must add 24 hours to it is counted as the next day
			  	// Not sure if this logic should be moved to database
			  	if(end < start){
			  		end += SECONDS_IN_DAY
			  	}
			  	// Then, filter by the selected time
	    		// We aren't sure which 'day' the specified time lands on, so we check both and return a match if either is satisfied
	    	  const withinTimeRange = ((start <= time && end >= time) || (start <= time+SECONDS_IN_DAY && end >= time+SECONDS_IN_DAY));
	    	  timeFound = withinTimeRange;
	    	  if(timeFound) break;	  			
	  		}
	  	}
	  	// Finally, filter by the searched name
	    if (name.indexOf(searchedName) !== -1 &&
	    		timeFound
	    	){
	    	filteredRestaurants.push(items[i])
	    }
	  }  	
	  this.setState({filteredRestaurants})
	}

	showModal = (restaurant) => {
		const {_id, name} = restaurant;
		let modalCheckboxes = {}
		this.props.collections.forEach(collection => modalCheckboxes[collection._id] = false )
		this.setState({
			showModal: true,
			modalTitle: name,
			modalId: _id,
			modalCheckboxes
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
const mapStateToProps = state => ({
	collections: state.collectionReducer.collections
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Restaurants);