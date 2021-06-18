import React from 'react';
import Loader from 'react-loader-spinner';

const PageSpinner = props => {
  return (
    props.spinners ?
      props.spinners.map(spinner =>
        <div key={spinner} className="loader">
          <Loader type="ThreeDots" color="#20BF6B" height={80} width={80} />
          <p>Загрузка...</p>
        </div>
      )
      : null
  );
}

export default PageSpinner;