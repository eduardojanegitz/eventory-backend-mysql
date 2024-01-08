import db from "../config/db.js";

export const getItemById = async (id) => {
  const [item] = await db.query(
    `SELECT * FROM EST_ITENS WHERE ITEM_IN_ID = ? `,
    [id]
  );
  return item[0];
};

export const getItemByTag = async (tag) => {
  const [item] = await db.query(
    `
  SELECT ITEM_IN_ID AS itemId, ITEM_ST_DESCRICAO AS description, ITEM_ST_NOME AS name,
  ITEM_ST_SERIE AS serialNumber, ITEM_ST_PATRIMONIO AS tag FROM EST_ITENS WHERE ITEM_ST_PATRIMONIO = ?
  `,
    [tag]
  );
  return item[0];
};

export const getAllItems = async () => {
  const [item] = await db.query(`
     SELECT 
      EI.ITEM_IN_ID AS _id,
      GF.FILIAL_IN_ID AS branchId,
      GF.FILIAL_ST_NOME AS branch, 
      EI.ITEM_ST_NOME AS name, 
      EI.ITEM_ST_DESCRICAO AS description, 
      EI.ITEM_DC_VALOR AS value, 
      GL.LOCALIZACAO_ST_NOME AS location, 
      EI.ITEM_ST_SERIE AS serialNumber, 
      EI.ITEM_ST_PATRIMONIO AS tag, 
      DATE_FORMAT(EI.ITEM_DT_AQUISICAO, '%m/%d/%Y') AS acquisitionDate,
      EG.GRUPO_IN_ID AS itemGroupId,
      EG.GRUPO_ST_NOME AS itemGroup, 
      GCC.CUSTO_IN_ID AS costCenterId,
      GCC.CUSTO_ST_NOME AS costCenter, 
      EI.ITEM_IN_NOTA AS invoice,  
      EI.ITEM_ST_FORNECEDOR AS supplier,
      CASE
        ITEM_CH_ATIVO 
        WHEN 'A' THEN 'Ativo'
        WHEN 'I' THEN 'Inativo'
        ELSE 'N/D'
      END AS active,
      DATE_FORMAT(EI.ITEM_DT_CRIACAO, '%d/%m/%Y %H:%i:%s') AS createdAt
    FROM 
      EST_ITENS EI 
    LEFT JOIN GLO_FILIAL GF ON 
      GF.FILIAL_IN_ID = EI.FILIAL_IN_ID 
    LEFT JOIN GLO_LOCALIZACAO GL ON 
      GL.LOCALIZACAO_IN_ID = EI.LOCALIZACAO_IN_ID 
    LEFT JOIN EST_GRUPOS EG ON 
      EG.GRUPO_IN_ID = EI.GRUPO_IN_ID 
    LEFT JOIN GLO_CENTRO_CUSTO GCC ON
      GCC.CUSTO_IN_ID = EI.CUSTO_IN_ID
    WHERE 
      EI.ITEM_CH_ATIVO <> 'B'
    `);

  return item;
};

export const getItemByLocation = async (location) => {
  const [item] = await db.query(
    `
    SELECT * FROM GLO_LOCALIZACAO WHERE LOCALIZACAO_ST_NOME = ?
  `,
    [location]
  );

  return item[0];
};

export const createItem = async (itemData) => {
  const {
    branch,
    name,
    description,
    value,
    location,
    responsable,
    serialNumber,
    tag,
    acquisitionDate,
    itemGroup,
    costCenter,
    invoice,
    supplier,
  } = itemData;

  const [response] = await db.query(
    `
    INSERT INTO EST_ITENS (
      FILIAL_IN_ID, 
      ITEM_ST_NOME, 
      ITEM_ST_DESCRICAO, 
      ITEM_DC_VALOR, 
      LOCALIZACAO_IN_ID, 
      ITEM_ST_RESPONSAVEL, 
      ITEM_ST_SERIE, 
      ITEM_ST_PATRIMONIO, 
      ITEM_DT_AQUISICAO,
      GRUPO_IN_ID, 
      CUSTO_IN_ID, 
      ITEM_IN_NOTA,
      ITEM_ST_FORNECEDOR
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      branch,
      name,
      description,
      value,
      location,
      responsable,
      serialNumber,
      tag,
      acquisitionDate,
      itemGroup,
      costCenter,
      invoice,
      supplier,
    ]
  );
  return response;
};

export const updateItem = async (id, itemData) => {
  const columnMappings = {
    branch: "FILIAL_IN_ID",
    name: "ITEM_ST_NOME",
    description: "ITEM_ST_DESCRICAO",
    value: "ITEM_DC_VALOR",
    responsable: "ITEM_ST_RESPONSAVEL",
    serialNumber: "ITEM_ST_SERIE",
    writeOffDate: "ITEM_DT_BAIXA",
    tag: "ITEM_ST_PATRIMONIO",
    acquisitionDate: "ITEM_DT_AQUISICAO",
    itemGroup: "GRUPO_IN_ID",
    costCenter: "CUSTO_IN_ID",
    invoice: "ITEM_ST_NOTA",
    active: "ITEM_CH_ATIVO",
    supplier: "ITEM_ST_FORNECEDOR",
  };

  const updateFields = [];
  const updateValues = [];

  for (const [key, value] of Object.entries(itemData)) {
    if (value === undefined || !columnMappings[key]) {
      continue;
    }

    updateFields.push(`${columnMappings[key]} = ?`);
    updateValues.push(value);
  }

  const updateQuery = `UPDATE EST_ITENS SET ${updateFields.join(
    ", "
  )} WHERE ITEM_IN_ID = ?`;
  const updateParams = [...updateValues, id];

  const [response] = await db.query(updateQuery, updateParams);

  return response;
};

export const activateItem = async (id) => {
  const [response] = await db.query(
    `UPDATE EST_ITENS SET ITEM_CH_ATIVO = 'A' WHERE ITEM_IN_ID = ?`,
    [id]
  );

  return response;
};

export const inactivateItem = async (id) => {
  const [response] = await db.query(
    `UPDATE EST_ITENS SET ITEM_CH_ATIVO = 'I' WHERE ITEM_IN_ID = ?`,
    [id]
  );

  return response;
};

export const writeOffItem = async (writeOffDate, id) => {
  const [response] = await db.query(
    `UPDATE EST_ITENS SET ITEM_CH_ATIVO = 'B', ITEM_DT_BAIXA = ? WHERE ITEM_IN_ID = ?`,
    [writeOffDate, id]
  );

  return response;
};
