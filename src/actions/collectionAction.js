import { 
	UPDATE_COLLECTIONS,
	REMOVED_FROM_COLLECTION,
	RENAME_COLLECTION,
	DELETED_COLLECTION,
	ADDED_TO_COLLECTION,
	FETCH_COLLECTIONS,
	CREATE_COLLECTION,
} from '../actionTypes'

import axios from 'axios';

import socket from '../socket'

export const removedFromCollection = (data) => {
	const {collectionId, restaurantId} = data;
	return {
		type: REMOVED_FROM_COLLECTION,
		payload:{
			collectionId,
			restaurantId,
		}
	}
}

export const addedToCollection = (data) => {
	const { restaurant, collectionId } = data;
	return{
		type: ADDED_TO_COLLECTION,
		payload: {
			restaurant,
			collectionId
		}
	}
}

export const renamedCollection = (bot) => dispatch => {
	dispatch({
		type: UPDATE_COLLECTIONS,
		payload: {
			bot
		}
	})
}

export const deletedCollection = (data) => {
	const { collectionId } = data;
	console.log(data);
	console.log(collectionId)
	return {
		type: DELETED_COLLECTION,
		payload: {
			collectionId
		}
	}
}

export const createCollection = (name, restaurantId) => dispatch => {
	axios.post('http://localhost:8080/api/CreateRestaurantCollection', {
	    name,
	    restaurantId
	})
	.then((response) => {
  		const collection = response.data;
		let storedCollectionIds = JSON.parse(localStorage.getItem('collectionIds')) || [];
		storedCollectionIds.push(collection._id);
		localStorage.setItem('collectionIds', JSON.stringify(storedCollectionIds));
		socket.emit('subscription', collection._id);
	    dispatch({
	    	type: CREATE_COLLECTION,
	    	payload: {
	    		collection
	    	}
	    })
	})
	.catch(function (error) {
	    console.log(error);
	});
}

export const fetchCollections = (collectionIds) => dispatch => {
    axios.get('http://localhost:8080/api/GetRestaurantCollections',{
    	params: {
    		collectionIds: collectionIds
    	}
    })
    .then(response => {
        const collections = response.data;
		dispatch({
			type: FETCH_COLLECTIONS,
			payload:{
				collections
			}
		})
    })
    .catch(function (error) {
      console.log(error);
    });
}



