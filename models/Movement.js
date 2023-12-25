import db from "../config/db.js";

const selectMovementsQuery = `    
    SELECT 
      M.MOVIMENTACAO_IN_ID AS _id, 
      I.ITEM_ST_NOME AS item, 
      L.LOCALIZACAO_ST_NOME AS location, 
      L2.LOCALIZACAO_ST_NOME AS newLocation, 
      M.MOVIMENTACAO_ST_MOTIVO AS reason, 
      M.MOVIMENTACAO_ST_OBSERVACAO AS observations, 
      U.USUARIO_ST_ALTERNATIVO AS user, 
      DATE_FORMAT(M.MOVIMENTACAO_DT_CRIACAO, '%d/%m/%Y %H:%i:%s') AS createdAt 
    FROM 
      EST_MOVIMENTACAO M 
    LEFT JOIN EST_ITENS I ON 
      I.ITEM_IN_ID = M.ITEM_IN_ID 
    LEFT JOIN GLO_LOCALIZACAO L ON 
      L.LOCALIZACAO_IN_ID = M.LOCALIZACAO_IN_ID 
    LEFT JOIN GLO_LOCALIZACAO L2 ON 
      L2.LOCALIZACAO_IN_ID = M.LOCALIZACAO_IN_ID_NOVA 
    LEFT JOIN GLO_USUARIOS U ON 
      U.USUARIO_IN_ID = M.USUARIO_IN_ID
`;

export const getAllMovement = async () => {
  const [movement] = await db.query(selectMovementsQuery);
  return movement;
};

export const createMovement = async (movementData) => {
  const { item, newLocation, reason, observations, user } = movementData;

  await db.query("START TRANSACTION");

  try {
    const [response] = await db.query(
      `
        INSERT INTO 
          EST_MOVIMENTACAO (
            ITEM_IN_ID, 
            LOCALIZACAO_IN_ID_NOVA, 
            MOVIMENTACAO_ST_MOTIVO, 
            MOVIMENTACAO_ST_OBSERVACAO, 
            USUARIO_IN_ID, 
            LOCALIZACAO_IN_ID
          ) 
        VALUES 
          (?,?,?,?,?, (
            SELECT 
              LOCALIZACAO_IN_ID 
            FROM 
          EST_ITENS 
            WHERE ITEM_IN_ID = ?)
          )`,
      [item, newLocation, reason, observations, user, item]
    );

    await db.query(
      "UPDATE EST_ITENS SET LOCALIZACAO_IN_ID = ? WHERE ITEM_IN_ID = ?",
      [newLocation, item]
    );

    await db.query("COMMIT");

    return response;
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};
