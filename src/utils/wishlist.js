import axios from "axios";
import toast from "react-hot-toast";

export const getWishlistIds = (auth) =>
  (auth?.user?.wishlist || []).map((item) =>
    typeof item === "string" ? item : item?._id
  );

export const isWishlisted = (auth, productId) =>
  getWishlistIds(auth).includes(productId);

export const syncAuthUser = (auth, setAuth, updates) => {
  const nextAuth = {
    ...auth,
    user: {
      ...auth.user,
      ...updates,
    },
  };

  setAuth(nextAuth);

  const stored = localStorage.getItem("auth");
  if (stored) {
    const parsed = JSON.parse(stored);
    localStorage.setItem(
      "auth",
      JSON.stringify({
        ...parsed,
        user: nextAuth.user,
      })
    );
  }
};

export const toggleWishlist = async ({
  auth,
  setAuth,
  productId,
  productName = "Product",
}) => {
  if (!auth?.token) {
    toast.error("Please login to save items to your wishlist");
    return false;
  }

  const alreadySaved = isWishlisted(auth, productId);
  const request = alreadySaved
    ? axios.delete(`/wishlist/${productId}`)
    : axios.post(`/wishlist/${productId}`);

  const { data } = await request;
  syncAuthUser(auth, setAuth, { wishlist: data?.wishlist || [] });
  toast.success(
    alreadySaved
      ? `${productName} removed from wishlist`
      : `${productName} saved to wishlist`
  );
  return !alreadySaved;
};
