import db from "../config/db.js";

export const getAllItemGroup = async () => {
  const [itemGroup] = await db.query(
    "SELECT GRUPO_IN_ID, GRUPO_ST_NOME, GRUPO_ST_DESCRICAO, GRUPO_IN_DEPRECIACAO, GRUPO_CH_ATIVO FROM EST_GRUPOS EG WHERE EG.GRUPO_CH_ATIVO = 'S'"
  )
  return itemGroup;
}

export const createItemGroup = async (itemGroupData) => {
  const { name, description, depreciation } = itemGroupData;

  const [response] = await db.query(
    "INSERT INTO EST_GRUPOS (GRUPO_ST_NOME, GRUPO_ST_DESCRICAO, GRUPO_IN_DEPRECIACAO) VALUES (?,?,?)",
    [name, description, depreciation]
  );

  return response;
};

export const updateItemGroup = async (id, itemGroupData) => {
  const {name, description, depreciation, active} = itemGroupData;

  const [itemGroup] = await db.query(
    "SELECT GRUPO_ST_NOME, GRUPO_ST_DESCRICAO, GRUPO_IN_DEPRECIACAO, GRUPO_CH_ATIVO FROM EST_GRUPOS WHERE GRUPO_IN_ID = ?",
    [id]
  );

  if (itemGroup.length === 0) {
    throw new Error("Nenhuma localização encontrada com esse ID!");
  }

  const [response] = await db.query(
    "UPDATE EST_GRUPOS SET GRUPO_ST_NOME = ?, GRUPO_ST_DESCRICAO = ?, GRUPO_IN_DEPRECIACAO = ?, GRUPO_CH_ATIVO = ? WHERE GRUPO_IN_ID = ?",
    [name, description, depreciation, active, id]
  )

  return response;
}

export const deleteItemGroup = async (id) => {
  const [itemGroup] = await db.query(
    "SELECT GRUPO_ST_NOME, GRUPO_ST_DESCRICAO, GRUPO_CH_ATIVO FROM EST_GRUPOS WHERE GRUPO_IN_ID = ?",
    [id]
  );

  if (itemGroup.length === 0) {
    throw new Error("Nenhum grupo de itens encontrado com esse ID!");
  }

  const [response] = await db.query(
    "DELETE FROM EST_GRUPOS WHERE GRUPO_IN_ID = ?",
    [id]
  );

  return response;
};
