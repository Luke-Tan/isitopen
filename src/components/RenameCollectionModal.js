import React, { Component } from "react"
import { Modal, Button, Form } from "react-bootstrap"

import axios from "axios"

import config from "../config"

export default class ShareCollectionModal extends Component {
  state = {
    name: ""
  }

  handleNameChange = event => {
    this.setState({
      name: event.target.value
    })
  }

  setName = () => {
    const { name } = this.props.collection
    this.setState({
      name
    })
  }
  renameCollection = () => {
    const { name } = this.state
    const { collection } = this.props
    const collectionId = collection._id
    console.log(collectionId)
    console.log(name)
    axios
      .post(`${config.baseUrl}/api/RenameRestaurantCollection`, {
        collectionId,
        name
      })
      .then(response => {})
      .catch(function(error) {
        console.log(error)
      })
    this.props.closeModal()
  }

  render() {
    return (
      <Modal
        onEnter={this.setName}
        show={this.props.showModal}
        onHide={this.props.closeModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>{`Rename collection`}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          <Form.Control
            onChange={this.handleNameChange}
            value={this.state.name}
            style={{ marginBottom: "1rem" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.renameCollection}>
            Rename
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
