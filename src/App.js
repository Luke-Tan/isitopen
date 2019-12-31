//Npm imports
import React , { Component } from 'react'
import {
	Tabs,
	Tab
} from 'react-bootstrap';

//CSS
import 'bootstrap/dist/css/bootstrap.min.css';

//Components
import Collections from './components/Collections'
import Restaurants from './components/Restaurants'

// Redux
import { connect } from 'react-redux';
import {
	fetchCollections,
} from './actions/collectionAction';

//Socket.io
import socket from './socket.js'

class App extends Component {
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
)(App);