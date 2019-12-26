import React , { Component } from 'react'
import {
	ListGroup,
	InputGroup,
	Form,
	Container,
	Row
} from 'react-bootstrap/';

import VirtualList from 'react-virtual-list';

import TimePicker from 'react-bootstrap-time-picker';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

const SECONDS_IN_DAY = 24 * 60 * 60

const DAYS = ['Mon', 'Tue' , 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const TEN_AM = 10 * 60 * 60

export default class ListExampleBasic extends Component {
  timer;
  constructor(){
  	super();
  	const selectedDays = {}
  	DAYS.forEach(day => selectedDays[day] = true )
    this.state = {
      time: TEN_AM,
      searchedName:'',
      selectedDays,
      items:[],
      filteredRestaurants:[],
    }

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
  	// console.log(time);
    this.setState({ time }, ()=>{
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
	  		if(selectedDays[day]){
		  		if(name.includes('osaka')){
		  			// console.log(this.state)
		  			console.log(day);
		  		}
		  		let {start, end} = items[i]['time'][day.toLowerCase()];
			  	// If the end is less than the start, we must add 24 hours to it is counted as the next day
			  	// Not sure if this logic should be moved to database
			  	if(end < start){
			  		end += SECONDS_IN_DAY
			  	}
	    		// We aren't sure which 'day' the specified time lands on, so we check both and return a match if either is satisfied
	    	  const asdf = ((start <= time && end >= time) || (start <= time+SECONDS_IN_DAY && end >= time+SECONDS_IN_DAY));
	    	  timeFound = asdf;
	    	  if(asdf) break;	  			
	  		}
	  	}
	    if (name.indexOf(searchedName) !== -1 &&
	    		timeFound
	    	){
	    	filteredRestaurants.push(items[i])
	    }
	  }  	
	  this.setState({filteredRestaurants})
	}

	handleChange = (event) => {
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

  render(){
  	const MyList = ({ virtual, itemHeight}) => (
			<ListGroup style={virtual.style}>
	        {
	          virtual.items.map((item,index)=>{
	            return( 
	              <div key={index} style={{height:itemHeight, display:'flex',flexDirection:'row'}}>
	                <ListGroup.Item className={'list-item'}>{item.name}</ListGroup.Item>
	                <ListGroup.Item className={'list-item'}>{item.openingHours}</ListGroup.Item>
	              </div>
	            )
	          })
	        }
	      </ListGroup>
		);

  	const MyVirtualList = VirtualList()(MyList);
    return(
      <Container>
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
					      		onChange={this.handleChange}
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
        {/*<ListGroup>
        {
          this.state.filteredRestaurants.map((item,index)=>{
            return( 
              <div key={index} style={{display:'flex',flexDirection:'row'}}>
                <ListGroup.Item style={{flex:1}}>{item.name}</ListGroup.Item>
                <ListGroup.Item style={{flex:1}}>{item.openingHours}</ListGroup.Item>
              </div>
            )
          })
        }
        </ListGroup>*/}
				<MyVirtualList
				  items={this.state.filteredRestaurants}
				  itemHeight={85}
				/>
      </Container>
    )
  }
}