import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { getImageUrl } from '../..';
import Auxiliary from '../Components/Auxiliary';
import { Helmet } from 'react-helmet';

const TITLE = 'Категории';

class Categories extends Component {

  sendCategoryName = (categoryName, id) => {
    localStorage.setItem("categoryName", categoryName);
    this.props.history.push(`/category/${id}`)
  }

  render() {

    const { categories } = this.props;

    return (
      <Auxiliary>
        <Helmet>
          <title>{TITLE}</title>
        </Helmet>
        <section className="section category">

          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="section-title">
                  <h1>все категории</h1>
                  {/* <small>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis veniam odio debitis ea veritatis quod nulla quisquam labore quo!</small> */}
                </div>
              </div>
              <div className="col-12">
                <div className="row">
                  {
                    categories.length ?
                      categories.map(category => {
                        return <Link
                          key={category._id}
                          to="#"
                          className="col-xl-4 col-lg-4 col-md-4 col-12"
                          onClick={() => this.sendCategoryName(category.categoryName, category._id)}
                        >
                          <div className="card-category">
                            <div className="card">
                              <div className="card-image" style={{ backgroundImage: `url(${getImageUrl}/${JSON.parse(category.images)[0]})` }}></div>
                              <div className="card-body">
                                <h5 className="card-title">{category.categoryName}</h5>
                              </div>
                            </div>
                          </div>
                        </Link>
                      })
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        </section>
      </Auxiliary>
    );
  }
}
const mapStateToProps = state => ({
  categories: state.categories.categories
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)