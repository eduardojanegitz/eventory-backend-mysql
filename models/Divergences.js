import db from "../config/db.js";

export const getAllDivergences = async () => {
  const [divergence] = await db.query(
    `
  SELECT 
    EI.INVENTARIO_IN_ID AS _id,
    GL.LOCALIZACAO_ST_NOME AS location, 
    GU.USUARIO_ST_ALTERNATIVO AS responsable,
    EI.INVENTARIO_DT_ATUALIZACAO AS createdAt
  FROM est_inventario ei 
  LEFT JOIN GLO_LOCALIZACAO GL ON 
    GL.LOCALIZACAO_IN_ID = EI.LOCALIZACAO_IN_ID 
  LEFT JOIN GLO_USUARIOS GU ON 
    GU.USUARIO_IN_ID = EI.USUARIO_IN_ID 
  WHERE EI.INVENTARIO_CH_STATUS = 'D'
`
  );
  return divergence;
};

export const getItemsDivergences = async (inventoryId) => {
  const [itemDivergence] = await db.query(
    `
  SELECT 
    EII.INVENTARIO_IN_ID as _id,
    EI.ITEM_IN_ID as itemId, 
    EI.ITEM_ST_NOME as name,
    GL.LOCALIZACAO_ST_NOME as location,
    EI.ITEM_ST_PATRIMONIO as tag
  FROM EST_INVENTARIO_ITEM EII 
  INNER JOIN EST_ITENS EI ON 
    EI.ITEM_IN_ID = EII.ITEM_IN_ID  
  INNER JOIN GLO_LOCALIZACAO GL ON 
    GL.LOCALIZACAO_IN_ID = EI.LOCALIZACAO_IN_ID 
  WHERE INVENTARIO_IN_ID = ?
  `,
    [inventoryId]
  );

  return itemDivergence;
};

export const getCorrectItems = async (inventoryId) => {
  const [itemDivergence] = await db.query(
    `
    SELECT 
      ET.ITEM_IN_ID as _id, 
      ET.ITEM_ST_NOME as name, 
      ET.ITEM_ST_PATRIMONIO as tag, 
      ET.LOCALIZACAO_IN_ID as location 
    FROM 
      EST_ITENS ET 
    WHERE 
      LOCALIZACAO_IN_ID = (SELECT LOCALIZACAO_IN_ID FROM EST_INVENTARIO WHERE INVENTARIO_IN_ID = ?)
  `,
    [inventoryId]
  );

  return itemDivergence;
};

