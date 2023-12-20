import db from "../config/db.js";

export const getAllMovement = async () => {
  const [movement] = await db.query(
    "SELECT M.MOVIMENTACAO_IN_ID, I.ITEM_ST_NOME, L.LOCALIZACAO_ST_NOME, L2.LOCALIZACAO_ST_NOME AS NOVA_LOCALIZACAO, M.MOVIMENTACAO_ST_MOTIVO, M.MOVIMENTACAO_ST_OBSERVACAO, U.USUARIO_ST_ALTERNATIVO, M.MOVIMENTACAO_DT_CRIACAO FROM EST_MOVIMENTACAO M LEFT JOIN EST_ITENS I ON I.ITEM_IN_ID = M.ITEM_IN_ID LEFT JOIN GLO_LOCALIZACAO L ON L.LOCALIZACAO_IN_ID = M.LOCALIZACAO_IN_ID LEFT JOIN GLO_LOCALIZACAO L2 ON L2.LOCALIZACAO_IN_ID = M.LOCALIZACAO_IN_ID_NOVA LEFT JOIN GLO_USUARIOS U ON U.USUARIO_IN_ID = M.USUARIO_IN_ID"
  );
  return movement;
};

export const createMovement = async (movementData) => {
  const { item, newLocation, reason, observations, user } = movementData;

  const [response] = await db.query(
    "INSERT INTO EST_MOVIMENTACAO (ITEM_IN_ID, LOCALIZACAO_IN_ID_NOVA, MOVIMENTACAO_ST_MOTIVO, MOVIMENTACAO_ST_OBSERVACAO, USUARIO_IN_ID, LOCALIZACAO_IN_ID) VALUES (?,?,?,?,?, (SELECT LOCALIZACAO_IN_ID FROM EST_ITENS WHERE ITEM_IN_ID = ?))",
    [item, newLocation, reason, observations, user, item]
  );

  await db.query(
    "UPDATE EST_ITENS SET LOCALIZACAO_IN_ID = ? WHERE ITEM_IN_ID = ?",
    [newLocation, item]
  );

  return response;
};



export const deleteLocation = async (id) => {
  const [location] = await db.query(
    "SELECT LOCALIZACAO_ST_NOME, LOCALIZACAO_ST_DESCRICAO, LOCALIZACAO_CH_ATIVO FROM GLO_LOCALIZACAO WHERE LOCALIZACAO_IN_ID = ?",
    [id]
  );

  if (location.length === 0) {
    throw new Error("Nenhuma localização encontrada com esse ID!");
  }

  const [response] = await db.query(
    "DELETE FROM GLO_LOCALIZACAO WHERE LOCALIZACAO_IN_ID = ?",
    [id]
  );

  return response;
};
