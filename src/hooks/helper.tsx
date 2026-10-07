
const STATUS_MAP: Record<string, string> = {
  "0": "Pending",
  "1": "Delivered",
  "2": "Processing",
  "3": "Shipped",
  "4": "Cancelled",
};

export const handleOrderStatus = (status: string) => {
    const badges: Record<string, string> = {
      "0": "bg-warning",
      "1": "bg-success",
      "2": "bg-danger",
      "3": "bg-secondary",
      "4": "bg-danger",
    };

    return (
      <span className={`badge ${badges[status] ?? "bg-danger"}`}>
        {STATUS_MAP[status] ?? "Cancelled"}
      </span>
    );
  };