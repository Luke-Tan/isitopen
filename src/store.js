import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import socket from './socket'

// actions
import { 
	removedFromCollection,
	addedToCollection,
	deletedCollection
} from './actions/collectionAction'

const store = createStore(rootReducer,applyMiddleware(thunk))

socket.on("restaurantRemoved", data => {
	store.dispatch(removedFromCollection(data));
});

socket.on("restaurantAdded", data => {
	store.dispatch(addedToCollection(data));
})

socket.on("collectionDeleted", data => {
	store.dispatch(deletedCollection(data));
})

socket.on("collectionCreated", data => {
	store.dispatch(deletedCollection(data));	
})

export default store;