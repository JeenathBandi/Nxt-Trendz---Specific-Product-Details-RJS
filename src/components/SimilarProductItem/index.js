// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProducts} = props
  const {brand, imageUrl, title, price, rating} = similarProducts

  return (
    <li className="similar-product-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <p className="similar-title">{title}</p>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-row-container">
        <p className="similar-price">Rs {price}/-</p>
        <div className="similar-rating-container">
          <p className="similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star-img"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
