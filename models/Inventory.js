import db from "../config/db.js";

export const getAllInventories = async () => {
  const [inventory] = await db.query(`
  SELECT 
    INV.INVENTARIO_IN_ID AS _id,
    DATE_FORMAT(INV.INVENTARIO_DT_CRIACAO, '%d/%m/%Y %h:%i:%s') AS createdAt,
    LOC.LOCALIZACAO_ST_NOME AS location, 
    USU.USUARIO_ST_ALTERNATIVO AS user,
    GC.CUSTO_ST_NOME AS costCenter
  FROM 
    EST_INVENTARIO INV
  LEFT JOIN GLO_LOCALIZACAO LOC ON 
    LOC.LOCALIZACAO_IN_ID = INV.LOCALIZACAO_IN_ID 
  LEFT JOIN GLO_USUARIOS USU ON 
    USU.USUARIO_IN_ID = INV.USUARIO_IN_ID 
  LEFT JOIN GLO_CENTRO_CUSTO GC ON 
    GC.CUSTO_IN_ID = INV.CUSTO_IN_ID
  WHERE
    INV.INVENTARIO_CH_STATUS = 'F'
  `);

  return inventory;
};

export const getAllItemsInventories = async (inventoryId) => {
  const [inventoryItem] = await db.query(
    `
  SELECT 
    EII.INVENTARIO_IN_ID AS _id,
    EI.ITEM_IN_ID AS itemId,
    EI.ITEM_ST_NOME AS name,
    EI.ITEM_ST_DESCRICAO AS description,
    GL.LOCALIZACAO_ST_NOME AS location, 
    EI.ITEM_ST_SERIE AS serialNumber,
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
    [inventoryId]
  );

  return inventoryItem;
};

export const openInventory = async (inventoryData) => {
  const { location, costCenter, user } = inventoryData;

  try {
    await db.query("START TRANSACTION");

    const [inventoryResponse] = await db.query(
      `INSERT INTO EST_INVENTARIO (
        LOCALIZACAO_IN_ID, 
        CUSTO_IN_ID,
        USUARIO_IN_ID)
      VALUES (?,?,?)`,
      [location, costCenter, user]
    );

    const inventoryId = inventoryResponse.insertId;

    await db.query("COMMIT");

    return inventoryId;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

export const addItemToInventory = async (itemId, inventoryId) => {
  const [response] = await db.query(
    `INSERT INTO EST_INVENTARIO_ITEM (
        ITEM_IN_ID,
        INVENTARIO_IN_ID) 
      VALUES (?, ?)`,
    [itemId, inventoryId]
  );

  return response;
};

export const isItemInInventory = async (itemId, inventoryId) => {
  try {
    const [result] = await db.query(
      "SELECT COUNT(*) as count FROM EST_INVENTARIO_ITEM WHERE ITEM_IN_ID = ? AND INVENTARIO_IN_ID = ?",
      [itemId, inventoryId]
    );

    const itemCount = result[0].count;

    return itemCount > 0;
  } catch (error) {
    console.error("Erro ao verificar se o item está no inventário: ", error);
    throw error;
  }
};

export const deleteItemInventory = async (itemId, inventoryId) => {
  const [response] = await db.query(
    `DELETE FROM EST_INVENTARIO_ITEM WHERE ITEM_IN_ID = ? AND INVENTARIO_IN_ID = ?`,
    [itemId, inventoryId]
  );

  return response;
};

export const finalizeInventory = async (inventoryId) => {
  await db.query(
    `UPDATE EST_INVENTARIO
       SET INVENTARIO_CH_STATUS = 'F'
       WHERE INVENTARIO_IN_ID = ?`,
    [inventoryId]
  );

  return true;
};

export const checkItemsLocationMatch = async (inventoryId, user) => {
  try {
    const [result] = await db.query(
      `SELECT ITEM_IN_ID 
       FROM EST_INVENTARIO_ITEM 
       WHERE INVENTARIO_IN_ID = ?`,
      [inventoryId]
    );

    const items = result.map((item) => item.ITEM_IN_ID);

    const [locationItemsResult] = await db.query(
      `SELECT ITEM_IN_ID 
       FROM EST_ITENS 
       WHERE LOCALIZACAO_IN_ID = (SELECT LOCALIZACAO_IN_ID FROM EST_INVENTARIO WHERE INVENTARIO_IN_ID = ?)`,
      [inventoryId]
    );

    const locationItems = locationItemsResult.map((item) => item.ITEM_IN_ID);

    const missingItems = items.filter((item) => !locationItems.includes(item));
    const extraItems = locationItems.filter((item) => !items.includes(item));

    if (missingItems.length > 0 || extraItems.length > 0) {
      await db.query(
        `UPDATE EST_INVENTARIO SET INVENTARIO_CH_STATUS = 'D' WHERE INVENTARIO_IN_ID = ?`,
        [inventoryId]
      );
      return false;
    }

    return true;
  } catch (error) {
    throw error;
  }
};
