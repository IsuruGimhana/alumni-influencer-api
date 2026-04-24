export const normalizeError = (err) => {
  const data = err.response?.data;

  // express-validator format
  if (data?.errors) {
    return data.errors;
  }

  // controller format
  if (data?.msg) {
    return [{ msg: data.msg }];
  }

  // fallback
  return [{ msg: "Something went wrong" }];
};