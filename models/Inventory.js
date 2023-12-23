import db from "../config/db.js";

export const getAllInventories = async () => {
  const [inventory] = await db.query("SELECT * FROM EST_INVENTARIO");
  return inventory;
};

export const createInventory = async (inventoryData) => {
  const { location, observation, user, items } = inventoryData;

  try {
    await db.query("START TRANSACTION");

    // Inserir o inventário
    const [inventoryResponse] = await db.query(
      "INSERT INTO EST_INVENTARIO (LOCALIZACAO_IN_ID, INVENTARIO_ST_OBSERVACAO, USUARIO_IN_ID) VALUES (?,?,?)",
      [location, observation, user]
    );

    const inventoryId = inventoryResponse.insertId;

    // Inserir os itens do inventário
    for (const item of items) {
      await db.query(
        "INSERT INTO EST_INVENTARIO_ITEM (INVENTARIO_IN_ID, ITEM_IN_ID) VALUES (?, ?)",
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

export const checkItemsLocationMatch = async (inventoryLocation, items, user) => {
  const [result] = await db.query(
    "SELECT COUNT(*) AS count FROM EST_ITENS WHERE LOCALIZACAO_IN_ID = ? AND ITEM_IN_ID IN (?)",
    [inventoryLocation, items]
  );

  const itemCount = result[0].count;

  if (itemCount !== items.length) {
    // Divergência detectada, inserir na tabela EST_DIVERGENCIA
    for (const item of items) {
      await db.query(
        "INSERT INTO EST_DIVERGENCIA (ITEM_IN_ID, LOCALIZACAO_IN_ID, USUARIO_IN_ID) VALUES (?, ?, ?)",
        [item, inventoryLocation, user]
      );
    }
    return false; // Retorna falso indicando que há divergência
  }

  // Retorna true se todos os itens têm a mesma localização
  return true;
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
