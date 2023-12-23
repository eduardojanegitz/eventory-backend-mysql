import mongoose from "mongoose";
import db from "../config/db.js";

export const getAllCostCenter = async () => {
  const [costCenter] = await db.query(
    "SELECT CUSTO_IN_ID as _id, CUSTO_ST_NOME as name, CUSTO_ST_DESCRICAO as description, CUSTO_CH_ATIVO as active, CUSTO_DT_CRIACAO as createdAt FROM GLO_CENTRO_CUSTO"
  );
  return costCenter;
};

export const createCostCenter = async (costCenterData) => {
  const { name, description } = costCenterData;

  const [response] = await db.query(
    "INSERT INTO GLO_CENTRO_CUSTO (CUSTO_ST_NOME, CUSTO_ST_DESCRICAO) VALUES (?,?)",
    [name, description]
  );
  return response;
};

export const updateCostCenter = async (id, costCenterData) => {
  const {name, description, active} = costCenterData;

  const [costCenter] = await db.query(
    "SELECT CUSTO_ST_NOME, CUSTO_ST_DESCRICAO, CUSTO_CH_ATIVO FROM GLO_CENTRO_CUSTO WHERE CUSTO_IN_ID = ?",
    [id]
  );

  if (costCenter.length === 0) {
    throw new Error("Nenhum centro de custo encontrado com esse ID!");
  }
  const updateFields = [];
  const updateValues = [];

  if (name !== undefined) {
    updateFields.push("CUSTO_ST_NOME = ?");
    updateValues.push(branch);
  }

  if (description !== undefined) {
    updateFields.push("CUSTO_ST_DESCRICAO = ?");
    updateValues.push(description);
  }

  if (active !== undefined) {
    updateFields.push("CUSTO_CH_ATIVO = ?");
    updateValues.push(active);
  }

  const updateQuery =
    "UPDATE GLO_CENTRO_CUSTO SET " + updateFields.join(", ") + " WHERE CUSTO_IN_ID = ?";

  const [response] = await db.query(updateQuery, [...updateValues, id]);

  return response;
}


export const deleteCostCenter = async (id) => {
  const [costCenter] = await db.query(
    "SELECT CUSTO_ST_NOME, CUSTO_ST_DESCRICAO, CUSTO_CH_ATIVO FROM GLO_CENTRO_CUSTO WHERE CUSTO_IN_ID = ?",
    [id]
  );

  if (costCenter.length === 0) {
    throw new Error("Nenhum centro de custo encontrado com esse ID!");
  }

  const [response] = await db.query(
    "DELETE FROM GLO_CENTRO_CUSTO WHERE CUSTO_IN_ID = ?",
    [id]
  );

  return response;
};
