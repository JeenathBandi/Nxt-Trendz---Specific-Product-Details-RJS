// Write your code here
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import Cookies from 'js-cookie'

import './index.css'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetailsList: [],
    apiStatus: apiStatusConstants.initial,
    count: 1,
  }

  componentDidMount() {
    this.renderProductItemDetails()
  }

  increaseCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  decreaseCount = () => {
    const {count} = this.state
    if (count === 1) {
      this.setState(prevState => ({count: 1}))
    } else {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  renderSuccessView = () => {
    const {productItemDetailsList, count} = this.state
    const {similarProducts} = productItemDetailsList
    const {
      availability,
      brand,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
      description,
    } = productItemDetailsList

    return (
      <div className="col-container">
        <div className="product-item-details-container">
          <img src={imageUrl} alt="product" className="product-images" />
          <div className="product-details-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="row-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </div>
              <p className="total-reviews-count">{totalReviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>
            <p className="available">Available: {availability}</p>
            <p className="available">Brand: {brand}</p>
            <hr className="seperator" />
            <div className="inc-dec-btn-container">
              <button
                type="button"
                className="btns"
                onClick={this.decreaseCount}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="count">{count}</p>
              <button
                type="button"
                className="btns"
                onClick={this.increaseCount}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-row-container">
          {similarProducts.map(each => (
            <SimilarProductItem similarProducts={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  redirectProducts = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="not-found-heading">Product Not Found</h1>
      <button
        type="button"
        className="add-cart-btn"
        onClick={this.redirectProducts}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()

      const similiarProducts = data.similar_products.map(each => ({
        availability: each.availability,
        brand: each.brand,
        id: each.id,
        imageUrl: each.image_url,
        price: each.price,
        rating: each.rating,
        style: each.style,
        title: each.title,
        description: each.description,
        totalReviews: each.total_reviews,
      }))

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        description: data.description,
        similarProducts: similiarProducts,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      this.setState({
        productItemDetailsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderAllPossibleViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {productItemDetailsList} = this.state
    return (
      <>
        <Header />
        {this.renderAllPossibleViews()}
      </>
    )
  }
}

export default ProductItemDetails
