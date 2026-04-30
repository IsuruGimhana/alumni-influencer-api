// convert "" -> null before sending to backend
export const sanitizePayload = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      typeof value === "string" && value.trim() === ""
        ? null
        : value,
    ])
  );
};