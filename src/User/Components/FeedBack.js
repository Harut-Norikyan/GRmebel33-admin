import React, { Component } from 'react';
import Api from '../../Api';
import AlertService from '../../Services/AlertService';
import Auxiliary from './Auxiliary';
import Loader from 'react-loader-spinner';

class FeedBack extends Component {
  state = {
    isShowFeedBack: false,
    phoneNumber: '',
    name: '',
    isInvalidPhoneNumber: false,
    isInvalidName: false,
    receivedAnApplication: "",
    showButtonSpinner: false
  }

  showFeedBack = () => {
    const { isShowFeedBack } = this.state;
    if (isShowFeedBack) this.setState({ isInvalidPhoneNumber: false, isInvalidName: false, name: '', phoneNumber: '' })
    this.setState({ isShowFeedBack: !isShowFeedBack });
  }

  onNumberChange = (event) => {
    if (
      event.target.value === '' ||
      (typeof +event.target.value === "number" &&
        Number(event.target.value) > 0 &&
        event.target.value.length < 11)
    ) {
      this.setState({ [event.target.name]: event.target.value })
    };
  }

  onChange = (event) => {
    if (event.target.value === '' || event.target.value.length < 30) {
      this.setState({ [event.target.name]: event.target.value })
    };
  }

  checkName = (name) => {
    const idValid = /^([a-zA-Zа-яА-Я]{1,15})([\s{0,1}]?)([\-\{0,1}]?)([a-zA-Zа-яА-Я]{2,15})$/;
    if (name && !idValid.test(name)) {
      this.setState({ isInvalidName: true }, () => {
        return false;
      });
    } else {
      this.setState({ isInvalidName: false }, () => {
        return true
      });
    }
  }

  checkPhoneNumber = (phoneNumber) => {
    if (phoneNumber && phoneNumber.length !== 10) {
      this.setState({ isInvalidPhoneNumber: true }, () => {
        return false;
      });
    } else {
      this.setState({ isInvalidPhoneNumber: false }, () => {
        return true
      });
    }
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { phoneNumber, isInvalidPhoneNumber, isInvalidName, name } = this.state;
    if ((!isInvalidPhoneNumber && !isInvalidName) && (phoneNumber && name)) {
      this.setState({ showButtonSpinner: true });
      Api.submitYourApplication(phoneNumber, name).then(response => {
        response.data?.receivedAnApplication && this.setState({
          receivedAnApplication: response.data.receivedAnApplication,
          showButtonSpinner: false
        })
      }).catch(error => this.getFail(error));
    }
  }

  getFail = (message) => {
    message && AlertService.alert("error", message);
    this.setState({ receivedAnApplication: "", showButtonSpinner: false });
  }

  render() {
    const { isShowFeedBack, phoneNumber, isInvalidPhoneNumber, receivedAnApplication, showButtonSpinner, name, isInvalidName } = this.state;
    return (
      <Auxiliary>
        <div className={isShowFeedBack ? "layer" : ""} onClick={this.showFeedBack} />
        <div className="bottom-ruler contact-us-button" onClick={this.showFeedBack}><i className="far fa-envelope"></i>
          {
            isShowFeedBack ?
              <form id="contact-us" className="box-shadow" onSubmit={this.onSubmit} onClick={event => event.stopPropagation()}>
                {
                  receivedAnApplication ?
                    <Auxiliary>
                      <h5 className="title">Ваша заявка принята !</h5>
                      <hr />
                      <p>
                        {receivedAnApplication}
                      </p>
                    </Auxiliary>
                    : <Auxiliary>
                      <h5 className="title">Закажите обратный звонок</h5>
                      <hr />
                      <small className="d-block mb-4">введите ваше имя и номер телефона и наши специалисты обязательно свяжутся с вами.</small>
                      <div className="form-group mb-3">
                        <label htmlFor="phoneNumber">Ваше имя<span className="red">*</span></label>
                        <div className="number-block">
                          <input
                            id="name"
                            type="text"
                            className={`form-control ${isInvalidName ? "error" : ""}`}
                            name="name"
                            value={name}
                            autoComplete="off"
                            onChange={this.onChange}
                            onBlur={() => this.checkName(name)}
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <label htmlFor="phoneNumber">Номер телефона<span className="red">*</span></label>
                        <div className="number-block">
                          <p className="operator-code">+7</p>
                          <input
                            id="phoneNumber"
                            type="tel"
                            className={`form-control phone-input ${isInvalidPhoneNumber ? "error" : ""}`}
                            name="phoneNumber"
                            value={phoneNumber}
                            autoComplete="off"
                            onChange={this.onNumberChange}
                            onBlur={() => this.checkPhoneNumber(phoneNumber)}
                          />
                        </div>
                        {
                          isInvalidPhoneNumber ?
                            <small className="error-text">Номер телефона не действительна</small>
                            : null
                        }
                      </div>
                      {
                        showButtonSpinner && !receivedAnApplication ?

                          <button type="submit" className="btn btn-primary disabled px-4">
                            <div className="mx-2">
                              <Loader type="ThreeDots" color="#fff" height={20} width={40} />
                            </div>
                          </button>
                          :
                          <button type="submit" className="btn btn-primary">
                            Отправить
                      </button>
                      }
                    </Auxiliary>
                }
              </form>
              : null
          }
        </div>
      </Auxiliary>
    );
  }
}

export default FeedBack;