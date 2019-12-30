import { 
	UPDATE_COLLECTIONS,
	REMOVE_FROM_COLLECTION,
	RENAME_COLLECTION,
	DELETE_COLLECTION,
	ADD_TO_COLLECTION
} from '../constants.js'

let initialState = {
	collections: []  
}

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_COLLECTIONS:
			return {
				...state,
				collections: action.payload.bot
			}
		default:
			return state
		}
}