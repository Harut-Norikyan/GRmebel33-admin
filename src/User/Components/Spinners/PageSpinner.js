import React from 'react';
import Loader from 'react-loader-spinner';

const PageSpinner = props => {
  return (
    props.spinners ?
      props.spinners.map(spinner =>
        <div key={spinner} className="loader">
          <Loader type="Bars" color="#20BF6B" height={120} width={120} />
          <p>Загрузка...</p>
        </div>
      )
      : null
  );
}

export default PageSpinner;