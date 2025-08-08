import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addCart } from "../redux/action";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isAvailable = product.rating?.count > 0;
  let variantOptions = [];

  if (
    product.category === "men's clothing" ||
    product.category === "women's clothing"
  ) {
    variantOptions = ["S", "M", "L"];
  } else if (product.category === "jewelery") {
    variantOptions = ["Silver", "Gold", "Platinum"];
  } else {
    variantOptions = ["Standard"];
  }
  const rating = product.rating?.rate || 0;

  const handleAdd = () => {
    if (!selectedVariant) {
      toast.error("Please select a variant first");
      return;
    }

    dispatch(addCart({ ...product, variant: selectedVariant }));
    toast.success(`Added to cart (${selectedVariant})`);
  };

  const renderStars = () => {
    const filledStars = Math.round(rating);
    return (
      <div className="mb-2 text-warning small">
        {"★".repeat(filledStars)}
        {"☆".repeat(5 - filledStars)}
        <span className="text-muted ms-2">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
      <div className="card text-center h-100 border-0 shadow-sm hover-shadow-lg transition">
        <div className="position-relative">
          <img
            className="card-img-top p-3"
            src={product.image}
            alt={product.title}
            height={300}
            style={{ objectFit: "contain" }}
          />
        </div>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title mt-1">{product.title}</h5>
          <p className="card-text text-muted small">
            {showFullDescription || product.description.length <= 60
              ? product.description
              : product.description.substring(
                  0,
                  product.description.lastIndexOf(" ", 60)
                ) + "..."}
          </p>
          {product.description.length > 60 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="btn btn-link p-0 text-decoration-none small"
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </button>
          )}
          {renderStars()}
          <select
            className="form-select my-2"
            value={selectedVariant}
            onChange={(e) => setSelectedVariant(e.target.value)}
            disabled={!isAvailable}
            style={{
              borderRadius: "6px",
              borderColor: "#ced4da",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <option value="">Select Variant</option>
            {variantOptions.map((variant) => (
              <option key={variant} value={variant}>
                {variant}
              </option>
            ))}
          </select>
        </div>

        <ul className="list-group list-group-flush">
          <li className="list-group-item lead">${product.price}</li>
        </ul>

        <div className="card-body d-flex flex-column gap-2">
          <Link to={`/product/${product.id}`} className="btn btn-outline-dark">
            Buy Now
          </Link>

          <button
            className="btn btn-dark"
            onClick={handleAdd}
            disabled={!isAvailable}
            title={
              !isAvailable ? "This product is currently out of stock." : ""
            }
          >
            {isAvailable ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
