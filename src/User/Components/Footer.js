import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Telegram from '../Images/Svg/Telegram';
import Viber from '../Images/Svg/Viber';
import WatsApp from '../Images/Svg/WatsApp';

class Footer extends Component {

  redirectToSocialNetworks = url => {
    window.location.href = url
  }

  render() {

    return (
      <footer className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="d-md-flex d-block">
                <div className="footer-info-wrapper mt-2">
                  <ul className="footer-info-list">
                    <Link to="/about-us" className="footer-block-title about-us">О нас</Link>
                    <p className="footer-block-title">Контакты</p>
                    <a className="header-footer-phone-number footer-phone" href="tel:+79018888879">+7 901 888 88 79</a>
                    <div>
                      <span>
                        <Telegram />
                      </span>
                      <span>
                        <WatsApp />
                      </span>
                      <span>
                        <Viber />
                      </span>
                    </div>
                  </ul>
                </div>
                <div className="footer-info-wrapper mt-2">
                  <ul className="footer-info-list">
                    <p className="footer-block-title">Адрес</p>
                    <p>601204, Владимирская область, Собинский р-н, г. Собинка, ул. Центральная, д. 24а</p>
                  </ul>
                </div>
                <div className="footer-info-wrapper mt-2">
                  <ul className="footer-info-list">
                    <p className="footer-block-title">Реквизиты компании</p>
                    <p>OOO "КОРОНА"</p>
                    <p>ОГРН 1023302351390</p>
                    <p>ИНН 3309005480</p>
                    <p>КПП 330901001</p>
                  </ul>
                </div>
                <div className="footer-info-wrapper mt-2">
                  <ul className="footer-info-list">
                    <p className="footer-block-title">
                      Присоединяйтесь к нам в социальных сетях
                  </p>
                    <div className="d-flex">
                      <li>
                        <a href="https://www.facebook.com/grmebel33/" target="_blank" rel="nofollow">
                          <i className="fab fa-facebook-square" />
                        </a>
                      </li>
                      <li>
                        <a href="https://vk.com/grmebel33" target="_blank" rel="nofollow">
                          <i className="fab fa-vk"></i>
                        </a>
                      </li>
                      <li>
                        <a href="https://www.instagram.com/grmebel33/" target="_blank" rel="nofollow">
                          <i className="fab fa-instagram-square" />
                        </a>
                      </li>
                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer >
    );
  }
}

export default withRouter(Footer);