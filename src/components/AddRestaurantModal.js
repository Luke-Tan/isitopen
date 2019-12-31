import React , { Component } from 'react'
import {
	Modal,
	ListGroup,
	Form,
	Button
} from 'react-bootstrap'
import axios from 'axios'
import { connect } from 'react-redux'
import { createCollection } from '../actions/collectionAction'

class AddRestaurantModal extends Component {
	state = {
		checkboxes: {}
	}
	
	closeAddRestaurantModal = () => {
		this.setState({
			checkboxes: {},
		})
	}

	handleChange = (event) => {
		const {checkboxes} = this.state;
		const { id } = event.target.dataset;
		console.log(id)
		const {checked} = event.target;
		this.setState({
			checkboxes: {
				...checkboxes,
				[id]: checked
			}
		})
	}

	addToCollections = () => {
		const { checkboxes } = this.state
		const { id } = this.props
		const newCollectionName = document.getElementById('new-collection-input').value;
		let collectionIds = [];
		for(let key in checkboxes){
			if(checkboxes[key]) collectionIds.push(key);
		}
		axios.post('http://localhost:8080/api/AddToRestaurantCollections', {
		    collectionIds: JSON.stringify(collectionIds),
		    restaurantId: id
		  })
		  .then( response => {
		  	// pass
		  })
		  .catch(function (error) {
		    console.log(error);
		  });

		//This creates a new collection
		if(newCollectionName){
			this.props.createCollection(newCollectionName, id);
		}
		this.props.closeModal();
	}

	render(){
		return(
	      <Modal show={this.props.showModal} onHide={this.props.closeModal}>
	        <Modal.Header closeButton>
	          <Modal.Title>{this.props.title}</Modal.Title>
	        </Modal.Header>
	        <Modal.Body>
	        	<Form.Control id="new-collection-input" placeholder="New collection" />
			    	{ this.props.collections.map((collection,index) => {
	        		const { _id, name } = collection;
	        		return (
	        			<ListGroup key={`collection-${_id}`} horizontal style={{height:'38px',flex:1, marginTop:'10px'}}>
					    		<ListGroup.Item style={{flex:1,}}>{name}</ListGroup.Item>
					    		<ListGroup.Item style={{display:'flex',alignItems:'center',justifyContent:'center',width:'38px'}}>
							      	<Form.Check 
							      		style={{padding:0}}
							      		checked={this.state.checkboxes[_id]} 
							      		onChange={this.handleChange}
							      		data-id={_id}
							      		type={'checkbox'} 
							      		id={`checkbox-${_id}`} 
							      	/>
					    		</ListGroup.Item>
				    		</ListGroup>
				    	)
			      })}
        	</Modal.Body>
	        <Modal.Footer>
	          <Button variant="secondary" onClick={this.closeAddRestaurantModal}>
	            Close
	          </Button>
	          <Button variant="primary" onClick={this.addToCollections}>
	            Add
	          </Button>
	        </Modal.Footer>
	      </Modal>
		)
	}
}

const mapStateToProps = state => ({
	collections: state.collectionReducer.collections,
});

const mapDispatchToProps = dispatch => ({
	createCollection: (name, restaurantId) => {
		dispatch(createCollection(name, restaurantId))
	},
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(AddRestaurantModal);