import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers/rootReducer";
import socket from "./socket";

// Actions
import {
  removedFromCollection,
  addedToCollection,
  deletedCollection,
  renamedCollection
} from "./actions/collectionAction";

const store = createStore(rootReducer, applyMiddleware(thunk));

//For all actions that require socket.io reactivity
socket.on("restaurantRemoved", data => {
  store.dispatch(removedFromCollection(data));
});

socket.on("restaurantAdded", data => {
  store.dispatch(addedToCollection(data));
});

socket.on("collectionDeleted", data => {
  store.dispatch(deletedCollection(data));
});

socket.on("collectionRenamed", data => {
  store.dispatch(renamedCollection(data));
});

export default store;
