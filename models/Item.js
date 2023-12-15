import mongoose from "mongoose";
import db from "../config/db.js";

export const getAllItems = async () => {
  const [item] = await db.query(
    "SELECT GF.FILIAL_ST_NOME, EI.ITEM_ST_NOME, EI.ITEM_ST_DESCRICAO, EI.ITEM_DC_VALOR, GL.LOCALIZACAO_ST_NOME, EI.ITEM_ST_SERIE, EI.ITEM_ST_PATRIMONIO, EI.ITEM_DT_AQUISICAO, EI.ITEM_DT_BAIXA, EG.GRUPO_ST_NOME, GCC.CUSTO_ST_NOME, EI.ITEM_IN_NOTA, EI.ITEM_BLOB_IMAGEM, EI.ITEM_DT_CRIACAO FROM EST_ITENS EI LEFT JOIN GLO_FILIAL GF ON GF.FILIAL_IN_ID = EI.FILIAL_IN_ID LEFT JOIN GLO_LOCALIZACAO GL ON GL.LOCALIZACAO_IN_ID = EI.LOCALIZACAO_IN_ID LEFT JOIN EST_GRUPOS EG ON EG.GRUPO_IN_ID = EI.GRUPO_IN_ID LEFT JOIN GLO_CENTRO_CUSTO GCC ON GCC.CUSTO_IN_ID = EI.CUSTO_IN_ID"
  );
  return item;
};

export const createItem = async (itemData) => {
  const {
    branchId,
    name,
    description,
    value,
    location,
    responsable,
    serialNumber,
    tag,
    acquisitionDate,
    writeOffDate,
    itemGroup,
    costCenter,
    invoice,
  } = itemData;

  const [response] = await db.query(
    "INSERT INTO EST_ITENS (FILIAL_IN_ID, ITEM_ST_NOME, ITEM_ST_DESCRICAO, ITEM_DC_VALOR, LOCALIZACAO_IN_ID, ITEM_ST_RESPONSAVEL, ITEM_ST_SERIE, ITEM_ST_PATRIMONIO, ITEM_DT_AQUISICAO, ITEM_DT_BAIXA, GRUPO_IN_ID, CUSTO_IN_ID, ITEM_IN_NOTA) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      branchId,
      name,
      description,
      value,
      location,
      responsable,
      serialNumber,
      tag,
      acquisitionDate,
      writeOffDate,
      itemGroup,
      costCenter,
      invoice,
    ]
  );
  return response;
};

