import db from "../config/db.js";

const selectLocationByIdQuery = `
  SELECT 
    GL.LOCALIZACAO_IN_ID AS _id,
    GL.LOCALIZACAO_ST_NOME AS name, 
    GL.LOCALIZACAO_ST_DESCRICAO AS description 
  FROM GLO_LOCALIZACAO GL
  WHERE
    LOCALIZACAO_IN_ID = ?
`;

const selectLocationQuery = `
  SELECT 
    GL.LOCALIZACAO_IN_ID AS _id,
    GL.LOCALIZACAO_ST_NOME AS name, 
    GL.LOCALIZACAO_ST_DESCRICAO AS description 
  FROM GLO_LOCALIZACAO GL
`;

export const getLocationById = async (id) => {
  const [location] = await db.query(selectLocationByIdQuery, [id]);
  return location[0];
};

export const getAllLocation = async () => {
  const [location] = await db.query(selectLocationQuery);
  return location;
};

export const createLocation = async (locationData) => {
  const { name, description } = locationData;

  const [response] = await db.query(
    `INSERT INTO GLO_LOCALIZACAO (
      LOCALIZACAO_ST_NOME, 
      LOCALIZACAO_ST_DESCRICAO
      )
    VALUES (?,?)`,
    [name, description]
  );

  return response;
};

export const updateLocation = async (id, locationData) => {
  const columnMappings = {
    name: "LOCALIZACAO_ST_NOME",
    description: "LOCALIZACAO_ST_DESCRICAO",
    active: "LOCALIZACAO_CH_ATIVO",
  };

  const updateFields = [];
  const updateValues = [];

  for (const [key, value] of Object.entries(locationData)) {
    if (value === undefined || !columnMappings[key]) {
      continue;
    }

    updateFields.push(`${columnMappings[key]} = ?`);
    updateValues.push(value);
  }

  const updateQuery = `UPDATE GLO_LOCALIZACAO SET ${updateFields.join(
    ", "
  )} WHERE LOCALIZACAO_IN_ID = ?`;
  const updateParams = [...updateValues, id];

  const [response] = await db.query(updateQuery, updateParams);

  return response;
};

const deleteLocationQuery = `
  DELETE FROM GLO_LOCALIZACAO WHERE LOCALIZACAO_IN_ID = ?
`;

export const deleteLocation = async (id) => {
  const [response] = await db.query(deleteLocationQuery, [id]);

  return response;
};
