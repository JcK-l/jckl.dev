export const formatDate = (date: Date, isComma=false): string => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}. ${month} ${isComma ? `${year},` : `${year} at`} ${hours}:${minutes}`;
};
