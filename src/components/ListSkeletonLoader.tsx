import { Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
  count?: number;
}

const ListSkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 3 }) => {
  return (
    <>
      <div className="row g-2">
        {Array.from({ length: count }).map((_, index) => (
          <div className="col-md-12" key={index}>
            <div className="card p-0">
              <Skeleton variant="rounded" height={64} style={{ backgroundColor: "#2a2a2a" }} /> {/* Row placeholder */}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListSkeletonLoader;
