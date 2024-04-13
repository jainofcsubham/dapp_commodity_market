export const parseJSON = (data: any):any => {
  return JSON.parse(
    JSON.stringify(
      data,
      (_key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    )
  );
};
