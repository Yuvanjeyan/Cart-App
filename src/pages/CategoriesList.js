import useCategory from "../hooks/useCategory";
import Jumbotron from "../components/cards/Jumbotron";
import { Link } from "react-router-dom";

export default function CategoriesList() {
  const categories = useCategory();

  return (
    <>
      <Jumbotron title="Categories" subTitle="List of all categories" />

      <div className="container-fluid page-shell py-4 py-lg-5">
        <div className="row g-4">
          {categories?.map((c) => (
            <div className="col-12 col-md-6" key={c._id}>
              <Link to={`/category/${c.slug}`} className="category-tile">
                <span className="category-tile__label">{c.name}</span>
                <span className="category-tile__meta">Explore collection</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
