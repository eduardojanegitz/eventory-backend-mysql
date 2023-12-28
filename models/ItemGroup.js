import db from "../config/db.js";

const selectItemGroupByIdQuery = `
  SELECT 
    GRUPO_IN_ID AS _id, 
    GRUPO_ST_NOME AS name, 
    GRUPO_ST_DESCRICAO AS description, 
    GRUPO_IN_DEPRECIACAO AS depreciation, 
    GRUPO_CH_ATIVO AS active
  FROM 
    EST_GRUPOS EG 
  WHERE 
    GRUPO_IN_ID = ?
`;

const selectItemGroupQuery = `
  SELECT 
    GRUPO_IN_ID AS _id, 
    GRUPO_ST_NOME AS name, 
    GRUPO_ST_DESCRICAO AS description, 
    GRUPO_IN_DEPRECIACAO AS depreciation, 
    CASE
      GRUPO_CH_ATIVO 
      WHEN 'S' THEN 'Ativo'
      WHEN 'N' THEN 'Inativo'
      ELSE 'N/D'
    END AS active
  FROM EST_GRUPOS EG 
`;

const selectIfItem = `SELECT * FROM EST_ITENS WHERE GRUPO_IN_ID = ?`

export const getItemGroupById = async (id) => {
  const [itemGroup] = await db.query(selectItemGroupByIdQuery, [id]);
  return itemGroup[0];
};

export const getAllItemGroup = async () => {
  const [itemGroup] = await db.query(selectItemGroupQuery);
  return itemGroup;
};

export const ifItem = async (id) => {
  const [teste] = await db.query(selectIfItem, [id]);
  return teste[0];
}

export const createItemGroup = async (itemGroupData) => {
  const { name, description, depreciation } = itemGroupData;

  const [response] = await db.query(
    `INSERT INTO EST_GRUPOS (
      GRUPO_ST_NOME, 
      GRUPO_ST_DESCRICAO, 
      GRUPO_IN_DEPRECIACAO
      ) VALUES (?,?,?)`,
    [name, description, depreciation]
  );

  return response;
};

export const updateItemGroup = async (id, itemGroupData) => {
  const columnMappings = {
    name: "GRUPO_ST_NOME",
    description: "GRUPO_ST_DESCRICAO",
    depreciation: "GRUPO_IN_DEPRECIACAO",
    active: "GRUPO_CH_ATIVO",
  };

  const updateFields = [];
  const updateValues = [];

  for (const [key, value] of Object.entries(itemGroupData)) {
    if (value === undefined || !columnMappings[key]) {
      continue;
    }

    updateFields.push(`${columnMappings[key]} = ?`);
    updateValues.push(value);
  }

  const updateQuery = `UPDATE EST_GRUPOS SET ${updateFields.join(
    ", "
  )} WHERE GRUPO_IN_ID = ?`;
  const updateParams = [...updateValues, id];

  const [response] = await db.query(updateQuery, updateParams);

  return response;
};
