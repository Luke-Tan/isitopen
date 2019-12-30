import { 
	UPDATE_COLLECTIONS,
	REMOVED_FROM_COLLECTION,
	RENAMED_COLLECTION,
	DELETED_COLLECTION,
	ADDED_TO_COLLECTION,
	CREATE_COLLECTION,
	FETCH_COLLECTIONS
} from '../constants.js'

let initialState = {
	collections: []  
}

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_COLLECTIONS: {
			return {
				...state,
				collections: action.payload.bot
			}			
		}
		case REMOVED_FROM_COLLECTION: {
			const { collectionId, restaurantId } = action.payload;
			let collections  = [...state.collections];
		  	let collectionIndex = collections.findIndex(collection => collection._id == collectionId);
		  	let restaurants = [...(collections[collectionIndex].restaurants)]; //Create a clone so we don't mess up when using splice
		  	let restaurantIndex = restaurants.findIndex(restaurant => restaurant._id === restaurantId);
		  	restaurants.splice(restaurantIndex, 1);
		  	collections[collectionIndex].restaurants = restaurants;
			return {
				...state,
				collections
			}			
		}
		case ADDED_TO_COLLECTION: {
		    const { restaurant, collectionId } = action.payload;
		    console.log("I was emitted to!");
		    let collections = [...state.collections];
		    for(let collection of collections){
		    	if(collection._id === collectionId){
		    		collection.restaurants.push(restaurant)
		    		break
		    	}	    	
		    }
		    return {
		    	...state,
		    	collections
		    }
		}
		case DELETED_COLLECTION: {
			const { collectionId } = action.payload;
			console.log(action.payload)
			console.log(collectionId);
		  	let collections = [...state.collections];
		  	console.log(collections);
		  	let collectionIndex = collections.findIndex(collection => collection._id == collectionId);
		  	collections.splice(collectionIndex,1)
		  	console.log(collections);
		  	return {
		  		...state,
		  		collections
		  	}
		}
		case FETCH_COLLECTIONS: {
			const { collections } = action.payload;
			return {
				...state,
				collections
			}			
		}
		case CREATE_COLLECTION: {
			const { collection } = action.payload;
			return {
				...state,
				collections: [...state.collections, collection]
			}
		}
		default:
			return state
		}
}