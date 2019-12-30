import React , { Component } from 'react';
import{
	Container,
	Col,
	Card,
	ListGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
	faPlus,
	faMinusCircle,
	faTrash,
	faEnvelope
} from '@fortawesome/free-solid-svg-icons'

class Collections extends Component {
	render(){
		return(
			<Container style={{}}>
				{/*<Row style={{paddingTop:'25px'}}>
				  <Button style={{fontWeight:'600'}} variant="primary" size="lg" block>
				  	<FontAwesomeIcon style={{marginRight:'5px'}}icon={faPlus} />
				    Create new collection
				  </Button>
			  </Row>*/}
			  <Row>
			  	{
			  		this.props.collections.map((collection, index) => (
					    <Col key={`restaurant-collection-${index}`} sm={4}>
						    <Card style={{ margin:'25px' }}>
								  <Card.Header style={{wordBreak:'break-all',display:'flex', alignItems:'center'}}>
								  	{collection.name}
								  	<FontAwesomeIcon 
								  		onClick={()=>{this.deleteCollection(collection._id)}}
								  		style={{color:'red',cursor:'pointer',display:'block',marginLeft:'auto'}}
								  		icon={faTrash} 
							  		/>
							  	</Card.Header>
								  <ListGroup variant="flush">
								    {
								    	collection.restaurants.map((restaurant, innerIndex)=>(
								    		<ListGroup.Item style={{wordBreak:'break-all',display:'flex', alignItems:'center'}} key={`restaurant-collection-${index}-${innerIndex}`}>
								    			{restaurant.name}
												  	<FontAwesomeIcon 
												  		onClick={()=>{this.removeFromCollection(collection._id, restaurant._id)}}
												  		style={{color:'red',cursor:'pointer',display:'block',marginLeft:'auto'}}
												  		icon={faMinusCircle} 
											  		/>
								    		</ListGroup.Item>
								    	))
								    }
								  </ListGroup>
								  <Card.Footer 
								  	onClick={()=>{this.shareRestaurantCollection(collection)}}
								  	style={{display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',backgroundColor:'rgb(91, 168, 251)', color:'white', textAlign:'center',borderTop: '0px'}}
							  	>
								  	<FontAwesomeIcon 
								  		style={{color:'white',marginRight:'10px'}}
								  		icon={faEnvelope} 
							  		/>
								  	Share
							  	</Card.Footer>
								</Card>
							</Col>
			  		))
			  	}
			  </Row>
			</Container>
		)
	}
}

const mapStateToProps = state => ({
	collections: state.collectionReducer.collections,
});

const mapDispatchToProps = dispatch => ({

});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ListExampleBasic);
					