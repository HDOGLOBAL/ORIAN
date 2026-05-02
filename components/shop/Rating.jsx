const Rating = ({ rating }) => {
  const maxRating = 5;
  const fullStar = <i className="fa-solid fa-star text-yellow-400"></i>;
  const halfStar = (
    <i className="fa-solid fa-star-half-alt text-yellow-400"></i>
  );
  const emptyStar = <i className="fa-solid fa-star text-gray-300"></i>;

  return (
    <div className="flex gap-1 text-sm">
      {Array.from({ length: maxRating }, (_, index) => {
        if (index < Math.floor(rating)) {
          return <span key={index}>{fullStar}</span>;
        } else if (index < rating && index < Math.ceil(rating)) {
          return <span key={index}>{halfStar}</span>;
        } else {
          return <span key={index}>{emptyStar}</span>;
        }
      })}
    </div>
  );
};

export default Rating;
