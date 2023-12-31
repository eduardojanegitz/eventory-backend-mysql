import db from "../config/db.js";

export const getAllDivergences = async () => {
  const [divergence] = await db.query(
    `
  SELECT 
    EI.INVENTARIO_IN_ID AS INVENTARIO,
    GL.LOCALIZACAO_ST_NOME AS LOCALIZACAO, 
    GU.USUARIO_ST_ALTERNATIVO AS RESPONSAVEL,
    EI.INVENTARIO_DT_ATUALIZACAO AS DATA_DIVERGENCIA
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
    EII.INVENTARIO_IN_ID,
    EI.ITEM_IN_ID, 
    EI.ITEM_ST_NOME,
    GL.LOCALIZACAO_ST_NOME,
    EI.ITEM_ST_PATRIMONIO 
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
    SELECT ET.ITEM_IN_ID, 
      ET.ITEM_ST_NOME, 
      ET.ITEM_ST_PATRIMONIO, 
      ET.LOCALIZACAO_IN_ID  
    FROM 
      EST_ITENS ET 
    WHERE 
      LOCALIZACAO_IN_ID = (SELECT LOCALIZACAO_IN_ID FROM EST_INVENTARIO WHERE INVENTARIO_IN_ID = ?)
  `,
    [inventoryId]
  );

  return itemDivergence;
};

