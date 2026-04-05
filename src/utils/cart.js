export const getAvailableStock = (product) =>
  Math.max(0, Number(product?.quantity || 0) - Number(product?.sold || 0));

export const getItemQuantity = (product) => Number(product?.cartQuantity || 1);

export const persistCart = (cart, setCart) => {
  setCart(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getCartCount = (cart = []) =>
  cart.reduce((total, item) => total + getItemQuantity(item), 0);

export const addProductToCart = (cart = [], product) => {
  const availableStock = getAvailableStock(product);

  if (availableStock < 1) {
    return {
      nextCart: cart,
      added: false,
      message: "This product is out of stock",
    };
  }

  const existingProductIndex = cart.findIndex((item) => item._id === product._id);

  if (existingProductIndex === -1) {
    return {
      nextCart: [...cart, { ...product, cartQuantity: 1 }],
      added: true,
      message: "Added to cart",
    };
  }

  const nextCart = [...cart];
  const existingProduct = nextCart[existingProductIndex];
  const nextQuantity = getItemQuantity(existingProduct) + 1;

  if (nextQuantity > availableStock) {
    return {
      nextCart: cart,
      added: false,
      message: `Only ${availableStock} item(s) available`,
    };
  }

  nextCart[existingProductIndex] = {
    ...existingProduct,
    cartQuantity: nextQuantity,
  };

  return {
    nextCart,
    added: true,
    message: "Cart quantity updated",
  };
};

export const updateProductQuantity = (cart = [], productId, nextQuantity) =>
  cart.map((item) =>
    item._id === productId ? { ...item, cartQuantity: nextQuantity } : item
  );
