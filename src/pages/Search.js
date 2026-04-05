import { useSearch } from "../context/search";
import ProductCard from "../components/cards/ProductCard";
import Jumbotron from "../components/cards/Jumbotron";

export default function Search() {
  const [values] = useSearch();

  return (
    <>
      <Jumbotron
        title="Search results"
        subTitle={
          values?.results?.length < 1
            ? "No products found"
            : `Found ${values?.results?.length} products`
        }
      />

      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row g-4">
          {values?.results?.map((p) => (
            <div key={p._id} className="col-12 col-md-6 col-xl-4">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
