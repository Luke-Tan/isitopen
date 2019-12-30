import { 
	UPDATE_COLLECTIONS,
	REMOVE_FROM_COLLECTION,
	RENAME_COLLECTION,
	DELETE_COLLECTION,
	ADD_TO_COLLECTION
} from '../constants.js'
import socket from '../socket'

export const updateBot = (bot) => dispatch => {
	dispatch({
		type: UPDATE_BOT,
		payload: {
			bot
		}
	})
}

export const removeFromCollection = (collections, collectionId, restaurantId) => dispatch => {
    socket.on("restaurantRemoved", data => {
	  	let collectionIndex = collections.findIndex(collection => collection._id == collectionId);
	  	let restaurants = [...(collections[collectionIndex].restaurants)]; //Create a clone so we don't mess up when using splice
	  	let restaurantIndex = restaurants.findIndex(restaurant => restaurant._id === restaurantId);
	  	restaurants.splice(restaurantIndex, 1);
	  	collections[collectionIndex].restaurants = restaurants;
		dispatch({
			type: UPDATE_BOT,
			collections: {
				collections
			}
		})
    });
}

export const renameCollection = (bot) => dispatch => {
	dispatch({
		type: UPDATE_BOT,
		payload: {
			bot
		}
	})
}

export const deleteCollection = (bot) => dispatch => {
	dispatch({
		type: UPDATE_BOT,
		payload: {
			bot
		}
	})
}

export const addToCollection = (bot) => dispatch => {
	dispatch({
		type: UPDATE_BOT,
		payload: {
			bot
		}
	})
}
