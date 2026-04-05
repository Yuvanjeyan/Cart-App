export default function Jumbotron({
  title,
  subTitle = "Welcome to React E-commerce",
}) {
  return (
    <div className="container-fluid jumbotron">
      <div className="jumbotron__overlay">
        <div className="container-fluid page-shell page-shell--wide">
          <div className="row align-items-center justify-content-center">
            <div className="col-lg-8 text-center jumbotron__content">
              <p className="jumbotron__eyebrow">Modern Shopping Experience</p>
              <h1 className="fw-bold jumbotron__title">{title}</h1>
              <p className="lead jumbotron__subtitle">{subTitle}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
