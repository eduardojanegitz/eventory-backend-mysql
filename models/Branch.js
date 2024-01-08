import db from "../config/db.js";

export const getBranchById = async (id) => {
  const [branchId] = await db.query(
    `
    SELECT 
      FILIAL_IN_ID 
    FROM 
      GLO_FILIAL 
    WHERE 
      FILIAL_IN_ID = ?
  `,
    [id]
  );
  return branchId;
};

export const getAllBranches = async () => {
  const [branch] = await db.query(`
  SELECT 
    FILIAL_IN_ID AS _id, 
    FILIAL_ST_NOME AS name, 
    FILIAL_ST_DESCRICAO AS description, 
    CASE 
      FILIAL_CH_ATIVO 
      WHEN 'A' THEN 'Ativo'
      WHEN 'I' THEN 'Inativo'
      ELSE 'N/D'
    END AS active,
    DATE_FORMAT(FILIAL_DT_CRIACAO, '%d/%m/%Y %H:%i%:%s') AS createdAt
  FROM 
    GLO_FILIAL`);
  return branch;
};

export const getAllActiveBranches = async () => {
  const [activeBranch] = await db.query(`
  SELECT 
    FILIAL_IN_ID AS _id, 
    FILIAL_ST_NOME AS name, 
    FILIAL_ST_DESCRICAO AS description, 
    DATE_FORMAT(FILIAL_DT_CRIACAO, '%d/%m/%Y %H:%i%:%s') AS createdAt
  FROM 
    GLO_FILIAL
  WHERE 
    FILIAL_CH_ATIVO = 'A'`);
  return activeBranch;
};

export const createBranch = async (branchData) => {
  const { name, description } = branchData;

  const [response] = await db.query(
    "INSERT INTO GLO_FILIAL (FILIAL_ST_NOME, FILIAL_ST_DESCRICAO) VALUES (?,?)",
    [name, description]
  );

  return response;
};

export const updateBranch = async (id, branchData) => {
  const { branch, description } = branchData;

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

  const updateQuery =
    "UPDATE GLO_FILIAL SET " +
    updateFields.join(", ") +
    " WHERE FILIAL_IN_ID = ?";

  const [response] = await db.query(updateQuery, [...updateValues, id]);

  return response;
};

export const activateBranch = async (id) => {
  const [response] = await db.query(
    `UPDATE GLO_FILIAL SET FILIAL_CH_ATIVO = 'A' WHERE FILIAL_IN_ID = ?`,
    [id]
  );

  return response;
};

export const inactivateBranch = async (id) => {
  const [response] = await db.query(
    `UPDATE GLO_FILIAL SET FILIAL_CH_ATIVO = 'I' WHERE FILIAL_IN_ID = ?`,
    [id]
  );

  return response;
};
