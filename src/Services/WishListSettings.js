class WishListSettings {

  static addOrRemoveProductFromWishList = (id) => {
    if (!id) return;
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("products")) {
        localStorage.setItem("products", JSON.stringify([id]));
        resolve(true);
      } else {
        var products = JSON.parse(localStorage.getItem("products"));
        var isExist = products.includes(id);
        if (!isExist) {
          //add
          products.push(id);
          localStorage.setItem("products", JSON.stringify(products));
          resolve(true)
        } else {
          //remove
          products = products.filter((item) => {
            return item !== id
          })
          localStorage.setItem("products", JSON.stringify(products));
          resolve(false)
        }
      }
    })
  }
}

export default WishListSettings;