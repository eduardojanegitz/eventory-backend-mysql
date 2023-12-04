import db from "../config/db.js";

export const getAllLocation = async () => {
  const [location] = await db.query(
    "SELECT GL.LOCALIZACAO_ST_NOME, GL.LOCALIZACAO_ST_DESCRICAO, GL.LOCALIZACAO_CH_ATIVO FROM GLO_LOCALIZACAO GL"
  );
  return location;
};

export const createLocation = async (locationData) => {
  const { name, description } = locationData;

  const [response] = await db.query(
    "INSERT INTO GLO_LOCALIZACAO (LOCALIZACAO_ST_NOME, LOCALIZACAO_ST_DESCRICAO) VALUES (?,?)",
    [name, description]
  );

  return response;
};

export const updateLocation = async (id, locationData) => {
  const {name, description, active} = locationData;

  const [location] = await db.query(
    "SELECT LOCALIZACAO_ST_NOME, LOCALIZACAO_ST_DESCRICAO, LOCALIZACAO_CH_ATIVO FROM GLO_LOCALIZACAO WHERE LOCALIZACAO_IN_ID = ?",
    [id]
  );

  if (location.length === 0) {
    throw new Error("Nenhuma localização encontrada com esse ID!");
  }

  const [response] = await db.query(
    "UPDATE GLO_LOCALIZACAO SET LOCALIZACAO_ST_NOME = ?, LOCALIZACAO_ST_DESCRICAO = ?, LOCALIZACAO_CH_ATIVO = ? WHERE LOCALIZACAO_IN_ID = ?",
    [name, description, active, id]
  )

  return response;
}

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
