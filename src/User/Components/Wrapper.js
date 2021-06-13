import React from 'react';
import Auxiliary from './Auxiliary';
import Footer from './Footer';
import Header from './Header';

const Wrapper = (props) => {
  return (
    <Auxiliary>
      <Header />
      <div className="main-container">
        {props.children}
      </div>
      <Footer />
    </Auxiliary>
  );
}

export default Wrapper;
