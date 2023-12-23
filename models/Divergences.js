import db from "../config/db.js";

export const getAllDivergences = async () => {
  const [divergence] = await db.query(
    "SELECT * FROM EST_DIVERGENCIA"
  );
  return divergence;
};
