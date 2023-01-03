// Libraries
import React, { Component } from 'react';
import { Row, Col, Form, Alert, Modal, Button } from 'react-bootstrap';
import axios from 'axios';
// Styling
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      form: { email: '' },
      show: false,
      formErrors: {
        email: null,
      },
      showExpAlert: false,
    };
  }
  closealert = (e) => {
    this.setState({ showExpAlert: false });
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    const { form, formErrors } = this.state;
    let formObj = {};

    formObj = {
      ...form,
      [name]: value,
    };

    this.setState({ form: formObj }, () => {
      if (!Object.keys(formErrors).includes(name)) return;
      let formErrorsObj = {};
      if (name === 'email') {
        let refValue = this.state.form[name === 'email' ? 'email' : 'email'];
        const errorMsg = this.validateField(name, value, refValue);
        formErrorsObj = { ...formErrors, [name]: errorMsg };
      } else {
        const errorMsg = this.validateField(
          name,
          name === 'email' ? this.state.form['email'] : value
        );
        formErrorsObj = { ...formErrors, [name]: errorMsg };
      }
      this.setState({ formErrors: formErrorsObj });
    });
  };

  validateField = (name, value, refValue) => {
    let errorMsg = null;
    switch (name) {
      case 'email':
        if (!value) errorMsg = '*Email is required';
        else if (
          !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            value
          )
        )
          errorMsg = 'Please enter a valid Email.';
        break;

      default:
        break;
    }
    return errorMsg;
  };

  validateForm = (form, formErrors, validateFunc) => {
    const errorObj = {};
    Object.keys(formErrors).map((x) => {
      let refValue = null;
      const msg = validateFunc(x, form[x], refValue);
      if (msg) errorObj[x] = msg;
    });
    return errorObj;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, formErrors } = this.state;
    const errorObj = this.validateForm(form, formErrors, this.validateField);
    if (Object.keys(errorObj).length !== 0) {
      this.setState({ formErrors: { ...formErrors, ...errorObj } });
      return false;
    } else {
      const request = {
        recieverMail: 'admin@elesol.com.au',
        body: `A potential customer with the following email wishes to communicate with Fly Pyramid \n\t Email: ${form.email}    \n\t Sincerly, Elesol bot`,
        subject: `Elesol New Lead Inquire`,
      };

      axios
        .post('https://power-support.lirten.com/api/sendMail/send', request)
        .then((res) => {
          if ((res.data.code = '0')) {
            setTimeout(() => {
              this.setState({ show: true, showExpAlert: false });
            }, 10).then(
              setTimeout(() => {
                this.setState({ show: false, showExpAlert: false });
              }, 3000)
            );
          }
        })
        .catch((error) =>
          this.setState({
            emptyemail: '',
            show: false,
            email: '',
            showExpAlert: true,
          })
        );
    }
  };

  render() {
    const { form, formErrors } = this.state;
    return (
      <div className="App">
        <div className="overlay">
          <img
            className="img-fluid"
            src={require('./images/Elecol Logo.png')}
            alt="Elesol Logo"
          />
          <div className="texts">
            <h1>COMING SOON 2020</h1>
            <h6>Awesomeness Is In The Works</h6>
            <div className="pt-5 production pb-5">
              <h4 style={{ textTransform: 'uppercase' }}>Live in the Light</h4>
              <p>
                Electricity is a weird thing don’t you think? Some waves moving
                around making things power <br className="d-none d-md-block" />
                on and creates light, only thing that would make it even better
                is if it’s cheaper! How you say?{' '}
                <br className="d-none d-md-block" />
                It’s simple, stay tuned and we’ll tell you how soon in 2020!
              </p>
            </div>
            <Form className="mt-5">
              <Row>
                <Col sm={12} lg={4}>
                  {' '}
                  <Form.Group className="formgroupmargin ">
                    <Form.Control
                      noValidate
                      required
                      type="email"
                      onChange={this.handleChange}
                      value={form.email}
                      name="email"
                      onBlur={this.handleChange}
                      placeholder="Enter Your Email Address"
                    />{' '}
                    {formErrors.email && (
                      <span className="inquiryerr">{formErrors.email}</span>
                    )}
                  </Form.Group>
                </Col>
                <Col sm={12} lg={4}>
                  {' '}
                  <Button onClick={this.handleSubmit}>Notify Me</Button>
                </Col>
              </Row>
            </Form>

            <Alert show={this.state.showExpAlert} variant="danger">
              {' '}
              <span className="closesubalertybtn">
                <i class="fas fa-times" onClick={this.closealert}></i>
              </span>
              <p>Server is currently down , Please try again later</p>
            </Alert>
            <Modal show={this.state.show}>
              <div id="snackbar">
                Thank You ! Your Inquiry was successfully Sent to us. We will
                get back soon to you.
              </div>
            </Modal>
          </div>
          <div className="socialicons mt-3 mb-3">
            <a
              href="https://www.facebook.com/Elesol-Australia-113951980291013/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f mr-4 "></i>
            </a>{' '}
            <a
              href="https://www.linkedin.com/m/company/elesol-australia/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-linkedin-in mx-4"></i>
            </a>
            <a
              href="https://www.instagram.com/elesolaus/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram mx-4"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}
export default App;
