import {
  UPDATE_COLLECTIONS,
  REMOVED_FROM_COLLECTION,
  RENAMED_COLLECTION,
  DELETED_COLLECTION,
  ADDED_TO_COLLECTION,
  FETCH_COLLECTIONS,
  CREATE_COLLECTION
} from "../actionTypes"

import axios from "axios"

import socket from "../socket"

import config from '../config'

export const removedFromCollection = data => {
  const { collectionId, restaurantId } = data
  return {
    type: REMOVED_FROM_COLLECTION,
    payload: {
      collectionId,
      restaurantId
    }
  }
}

export const addedToCollection = data => {
  const { restaurant, collectionId } = data
  return {
    type: ADDED_TO_COLLECTION,
    payload: {
      restaurant,
      collectionId
    }
  }
}

export const renamedCollection = data => dispatch => {
  const { collectionId, name } = data
  dispatch({
    type: RENAMED_COLLECTION,
    payload: {
      collectionId,
      name
    }
  })
}

export const deletedCollection = data => {
  const { collectionId } = data
  // Remove the key from localstorage but not technically necessary
  const collectionIds = JSON.parse(localStorage.getItem("collectionIds")) || []
  const collectionIdIndex = collectionIds.findIndex(
    collection => collection._id === collectionId
  )
  collectionIds.splice(collectionIdIndex, 1)
  localStorage.setItem("collectionIds", JSON.stringify(collectionIds))
  return {
    type: DELETED_COLLECTION,
    payload: {
      collectionId
    }
  }
}

export const createCollection = (name, restaurantId) => dispatch => {
  axios
    .post(`${config.baseUrl}/api/CreateRestaurantCollection`, {
      name,
      restaurantId
    })
    .then(response => {
      const collection = response.data
      let storedCollectionIds =
        JSON.parse(localStorage.getItem("collectionIds")) || []
      storedCollectionIds.push(collection._id)
      localStorage.setItem("collectionIds", JSON.stringify(storedCollectionIds))
      socket.emit("subscription", collection._id)
      dispatch({
        type: CREATE_COLLECTION,
        payload: {
          collection
        }
      })
    })
    .catch(function(error) {
      console.log(error)
    })
}

export const fetchCollections = collectionIds => dispatch => {
  axios
    .get(`${config.baseUrl}/api/GetRestaurantCollections`, {
      params: {
        collectionIds: collectionIds
      }
    })
    .then(response => {
      const collections = response.data
      dispatch({
        type: FETCH_COLLECTIONS,
        payload: {
          collections
        }
      })
    })
    .catch(function(error) {
      console.log(error)
    })
}
