import db from "../config/db.js";

export const getAllInventories = async () => {
  const [inventory] = await db.query(`
  SELECT 
    INV.INVENTARIO_IN_ID AS _id,
    DATE_FORMAT(INV.INVENTARIO_DT_CRIACAO, '%d/%m/%Y %h:%i:%s') AS createdAt,
    LOC.LOCALIZACAO_ST_NOME AS location, 
    USU.USUARIO_ST_ALTERNATIVO AS user
  FROM EST_INVENTARIO INV
  LEFT JOIN GLO_LOCALIZACAO LOC ON 
    LOC.LOCALIZACAO_IN_ID = INV.LOCALIZACAO_IN_ID 
  LEFT JOIN GLO_USUARIOS USU ON 
    USU.USUARIO_IN_ID = INV.USUARIO_IN_ID 
  `);
  return inventory;
};

export const getAllItemsInventories = async (id) => {
  const [inventoryItem] = await db.query(
    `
  SELECT 
    EII.INVENTARIO_ITEM_IN_ID AS _id,
    EI.ITEM_ST_NOME AS nome,
    EI.ITEM_ST_DESCRICAO AS descricao,
    GL.LOCALIZACAO_ST_NOME AS localizacao, 
    EI.ITEM_ST_SERIE AS serial,
    EI.ITEM_ST_PATRIMONIO AS tag
  FROM
    EST_INVENTARIO_ITEM EII 
  LEFT JOIN EST_INVENTARIO INV ON 
    INV.INVENTARIO_IN_ID = EII.INVENTARIO_IN_ID 
  LEFT JOIN GLO_LOCALIZACAO GL ON 
    GL.LOCALIZACAO_IN_ID = INV.LOCALIZACAO_IN_ID 
  LEFT JOIN EST_ITENS EI ON 
    EI.ITEM_IN_ID = EII.ITEM_IN_ID 
  WHERE 
	  EII.INVENTARIO_IN_ID = ? 
  `,
    [id]
  );
  return inventoryItem;
};

export const createInventory = async (inventoryData) => {
  const { location, observation, user, items } = inventoryData;

  try {
    await db.query("START TRANSACTION");

    const [inventoryResponse] = await db.query(
      `INSERT INTO EST_INVENTARIO (
        LOCALIZACAO_IN_ID, 
        INVENTARIO_ST_OBSERVACAO, 
        USUARIO_IN_ID)
      VALUES (?,?,?)`,
      [location, observation, user]
    );

    const inventoryId = inventoryResponse.insertId;

    for (const item of items) {
      await db.query(
        `INSERT INTO EST_INVENTARIO_ITEM (
          INVENTARIO_IN_ID, 
          ITEM_IN_ID) 
        VALUES (?, ?)`,
        [inventoryId, item]
      );
    }

    await db.query("COMMIT");

    return inventoryResponse;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

export const checkItemsLocationMatch = async (
  inventoryLocation,
  items,
  user
) => {
  const [result] = await db.query(
    `SELECT 
      ITEM_IN_ID 
    FROM 
      EST_ITENS 
    WHERE 
      LOCALIZACAO_IN_ID = ?`,
    [inventoryLocation]
  );

  const locationItems = result.map((item) => item.ITEM_IN_ID);

  const missingItems = items.filter((item) => !locationItems.includes(item));
  const extraItems = locationItems.filter((item) => !items.includes(item));

  if (missingItems.length > 0 || extraItems.length > 0) {
    for (const item of missingItems.concat(extraItems)) {
      await db.query(
        `INSERT INTO EST_DIVERGENCIA (
          ITEM_IN_ID, 
          LOCALIZACAO_IN_ID, 
          USUARIO_IN_ID) 
        VALUES (?, ?, ?)`,
        [item, inventoryLocation, user]
      );
    }
    return false;
  }

  return true;
};
