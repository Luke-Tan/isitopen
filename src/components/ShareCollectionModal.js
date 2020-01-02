import React, { Component } from "react"
import { Modal, Button, Form } from "react-bootstrap"

import axios from "axios"

import config from "../config"

export default class ShareCollectionModal extends Component {
  state = {
    emailRecipients: [""],
  }

  addEmailRecipient = () => {
    this.setState({
      emailRecipients: [...this.state.emailRecipients, ""]
    })
  }

  handleEmailChange = event => {
    const { emailRecipients } = this.state
    const { index } = event.target.dataset
    const { value } = event.target
    emailRecipients[index] = value
    this.setState({
      emailRecipients
    })
  }

  shareCollection = () => {
    const { emailRecipients } = this.state
    const { collection } = this.props
    axios
      .post(`${config.baseUrl}/api/InviteFriends`, {
        emails: emailRecipients,
        collection
      })
      .then(response => {
        //
      })
      .catch(function(error) {
        console.log(error)
      })
    this.props.closeModal()
  }

  render() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{`Share`}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: "center" }}>
          {this.state.emailRecipients.map((email, index) => (
            <Form.Control
              key={`share-email-input-${index}`}
              onChange={this.handleEmailChange}
              value={email}
              id={`share-email-input-${index}`}
              data-index={index}
              style={{ marginBottom: "1rem" }}
              placeholder="johndoe@gmail.com"
            />
          ))}
          <Button variant="primary" onClick={this.addEmailRecipient}>
            Add
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.shareCollection}>
            Share
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
