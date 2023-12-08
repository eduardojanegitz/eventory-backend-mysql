import db from "../config/db.js";

export const getAllBranches = async () => {
  const [branch] = await db.query(
    "SELECT FILIAL_IN_ID, FILIAL_ST_NOME, FILIAL_ST_DESCRICAO, FILIAL_CH_ATIVO, FILIAL_DT_CRIACAO FROM GLO_FILIAL"
  );
  return branch;
};

export const createBranch = async (branchData) => {
  const { branch, description } = branchData;

  const [response] = await db.query(
    "INSERT INTO GLO_FILIAL (FILIAL_ST_NOME, FILIAL_ST_DESCRICAO) VALUES (?,?)",
    [branch, description]
  );

  return response;
};

export const updateBranch = async (id, branchData) => {
  const {branch, description, active} = branchData;

  const [branchQuery] = await db.query(
    "SELECT FILIAL_ST_NOME, FILIAL_ST_DESCRICAO, FILIAL_CH_ATIVO FROM GLO_FILIAL WHERE FILIAL_IN_ID = ?",
    [id]
  );

  if (branchQuery.length === 0) {
    throw new Error("Nenhuma filial encontrada com esse ID!");
  }
  const updateFields = [];
  const updateValues = [];

  if (branch !== undefined) {
    updateFields.push("FILIAL_ST_NOME = ?");
    updateValues.push(branch);
  }

  if (description !== undefined) {
    updateFields.push("FILIAL_ST_DESCRICAO = ?");
    updateValues.push(description);
  }

  if (active !== undefined) {
    updateFields.push("FILIAL_CH_ATIVO = ?");
    updateValues.push(active);
  }

  const updateQuery =
    "UPDATE GLO_FILIAL SET " + updateFields.join(", ") + " WHERE FILIAL_IN_ID = ?";

  const [response] = await db.query(updateQuery, [...updateValues, id]);

  return response;
}

export const deleteBranch = async (id) => {
  const [branch] = await db.query(
    "SELECT FILIAL_ST_NOME, FILIAL_ST_DESCRICAO, FILIAL_CH_ATIVO FROM GLO_FILIAL WHERE FILIAL_IN_ID = ?",
    [id]
  );

  if (branch.length === 0) {
    throw new Error("Nenhuma filial encontrada com esse ID!");
  }

  const [response] = await db.query(
    "DELETE FROM GLO_FILIAL WHERE FILIAL_IN_ID = ?",
    [id]
  );

  return response;
};
