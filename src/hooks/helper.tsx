
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

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

export const formatTime = (dateString: string) => {
  //format in PM or AM

  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  return new Date(dateString).toLocaleTimeString(undefined, options);
}