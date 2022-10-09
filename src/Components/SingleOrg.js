import React, { useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function SingleOrg() {
  const { id } = useParams();

  const [singleOrgInfo, setSingleOrgInfo] = useState({});
  const [error, setError] = useState("");

  const fetchSingleOrg = useCallback(async () => {
    let { data: Organization, error } = await supabase
      .from("Organization")
      .select("*")
      .eq("id", id)
      .single();
    error ? setError(error.message) : setSingleOrgInfo(Organization);
  }, [id]);

  useEffect(() => {
    fetchSingleOrg();
    return () => {
      setSingleOrgInfo({});
    };
  }, [fetchSingleOrg]);

  let {
    name,
    address,
    phone,
    email,
    description,
    imageUrl,
    rating,
    hours,
    webUrl,
  } = singleOrgInfo;

  // notes: some basic sizing styling applied to image
  // questions for wireframing: should the info be displayed alone, or with a title like "email: "?
  // should information not available notice be displayed? seems useful for dev purposes
  // but might not be needed for users
  return (
    <div>
      {error && !singleOrgInfo.id ? (
        <div>
          <h1>Organization Id Not Found!</h1>
          <h3>Error: {error}</h3>
        </div>
      ) : (
        singleOrgInfo.id && (
          <div>
            <h1>{name}</h1>
            <h4>{address}</h4>
            <img
              style={{
                maxWidth: "500px",
                maxHeight: "500px",
                objectFit: "contain",
              }}
              alt="Organization Img"
              src={imageUrl}
            />
            <h3>{description}</h3>
            <h4>Rating: {rating ? rating : "not available"}</h4>
            <h4>Website: {webUrl ? webUrl : "not available"}</h4>
            <h4>Hours: {hours ? hours : "not available"}</h4>
            <h4>Tel: {phone ? phone : "not available"} </h4>
            <h4>Email: {email ? email : "not available"}</h4>
          </div>
        )
      )}
    </div>

    //name, address, phone, email, description, image, rating, hours, webUrl,
    // <div className="single-product-container">
    //   {props.isAdmin && <EditProduct productId={props.match.params.id} />}
    //   {product && (
    //     <div className="product-view">
    //       <div className="single-product-left">
    //         <img
    //           src={product.imageUrl}
    //           alt="image"
    //           className="single-product-img"
    //         />
    //       </div>
    //       <div className="single-product-info">
    //         <div className="info-top">
    //           <h2>{product.name}</h2>
    //           <h3>Price: ${(Math.round(product.price) / 100).toFixed(2)}</h3>
    //           <p>{product.description}</p>
    //           <p style={{ fontSize: "90%", fontStyle: "italic" }}>
    //             category: {product.category}
    //           </p>
    //         </div>
    //         <div className="info-bottom">
    //           {!props.isLoggedIn && <p>For now: please log in to shop.</p>}
    //           {props.cartProducts &&
    //           props.isLoggedIn &&
    //           props.cartProducts.map((elem) => elem.id).includes(+id) ? (
    //             <div>
    //               <EditQuantity
    //                 quant={props.singleCartProduct.quantity}
    //                 productId={props.match.params.id}
    //               />
    //             </div>
    //           ) : (
    //             props.isLoggedIn && (
    //               <form onSubmit={handleAdd} className="add-to-cart-buttons">
    //                 <button
    //                   onClick={decreaseQuantity}
    //                   className="circle-button"
    //                 >
    //                   -
    //                 </button>

    //                 <label htmlFor="quantityCount">
    //                   Quantity: {quantityCount}
    //                 </label>
    //                 <button
    //                   onClick={increaseQuantity}
    //                   className="circle-button"
    //                 >
    //                   +
    //                 </button>

    //                 <p className="edit-quant-submit-buttons">
    //                   <button type="submit" style={{ padding: "5px" }}>
    //                     Add To Cart
    //                   </button>
    //                 </p>
    //               </form>
    //             )
    //           )}
    //           {/* <p>
    //             See more in this product's category:{" "}
    //             <span>{product.category}</span>
    //           </p> */}
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
}
// const mapState = (state) => {
//   return {
//     singleProduct: state.product,
//     auth: state.auth,
//     cartProducts: state.cartProducts,
//     singleCartProduct: state.singleCartProduct,
//     isLoggedIn: !!state.auth.id,
//     isAdmin: !!state.auth.isAdmin,
//   };
// };

// const mapDispatch = (dispatch) => {
//   return {
//     getSingleProduct: (productId) => dispatch(fetchSingleProduct(productId)),
//     clearSingleProduct: () => dispatch(setSingleProduct({})),
//     getCartProducts: (userId, apiHeaders) =>
//       dispatch(fetchCartProducts(userId, apiHeaders)),
//     getCartProduct: (userId, productId, apiHeaders) =>
//       dispatch(fetchCartProduct(userId, productId, apiHeaders)),
//     clearCartProduct: () => dispatch(setCartProduct({})),
//   };
// };

// export default connect(mapState, mapDispatch)(SingleProduct);
