import db from "../config/db.js";
import bcrypt from "bcrypt";

const selectUserByIdQuery = `SELECT USUARIO_IN_ID as _id, 
    USUARIO_ST_ALTERNATIVO as username, 
    USUARIO_ST_NOME as name, 
    USUARIO_ST_EMAIL as email, 
    USUARIO_ST_DEPARTAMENTO as department, 
    USUARIO_ST_PERMISSAO as roles, 
    DATE_FORMAT(USUARIO_DT_CRIACAO, '%d/%m/%Y %H:%i:%s') AS createdAt 
  FROM GLO_USUARIOS 
  WHERE USUARIO_IN_ID = ?`;

const selectUsersQuery = `SELECT USUARIO_IN_ID as _id, 
    USUARIO_ST_ALTERNATIVO AS username, 
    USUARIO_ST_NOME AS name, 
    USUARIO_ST_EMAIL AS email, 
    USUARIO_ST_DEPARTAMENTO AS department, 
    USUARIO_ST_PERMISSAO AS roles,
    CASE 
      USUARIO_CH_ATIVO
      WHEN 'S' THEN 'Ativo'
      WHEN 'N' THEN 'Inativo'
      ELSE 'N/D'
    END AS active,
    DATE_FORMAT(USUARIO_DT_CRIACAO, '%d/%m/%Y %H:%i:%s') AS createdAt 
  FROM GLO_USUARIOS`;

const selectUserByUsernameQuery = `SELECT USUARIO_ST_ALTERNATIVO, 
    USUARIO_ST_NOME, USUARIO_ST_EMAIL, 
    USUARIO_ST_DEPARTAMENTO, 
    USUARIO_ST_PERMISSAO 
    FROM GLO_USUARIOS 
   WHERE 
    USUARIO_ST_ALTERNATIVO = ?`;

export const getUserById = async (id) => {
  const [user] = await db.query(selectUserByIdQuery, [id]);
  return user[0];
};

export const getAllUsers = async () => {
  const [users] = await db.query(selectUsersQuery);
  return users;
};

export const getUserByUsername = async (username) => {
  const [user] = await db.query(selectUserByUsernameQuery, [username]);
  return user[0];
};

export const createUser = async (userData) => {
  const { username, password, name, email, department, roles } = userData;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const [response] = await db.query(
    `INSERT INTO GLO_USUARIOS (
      USUARIO_ST_ALTERNATIVO, 
      USUARIO_ST_SENHA, 
      USUARIO_ST_NOME, 
      USUARIO_ST_EMAIL, 
      USUARIO_ST_DEPARTAMENTO,
      USUARIO_ST_PERMISSAO) 
    VALUES (?, ?, ?, ?, ?, ?)`,
    [username, passwordHash, name, email, department, roles]
  );

  return response;
};

export const updateUser = async (id, userData) => {
  const columnMappings = {
    username: "USUARIO_ST_ALTERNATIVO",
    name: "USUARIO_ST_NOME",
    email: "USUARIO_ST_EMAIL",
    password: "USUARIO_ST_SENHA",
    department: "USUARIO_ST_DEPARTAMENTO",
    roles: "USUARIO_ST_PERMISSAO",
    active: "USUARIO_CH_ATIVO",
  };

  const updateFields = [];
  const updateValues = [];

  for (const [key, value] of Object.entries(userData)) {
    if (value === undefined || !columnMappings[key]) {
      continue;
    }

    if (key === "password") {
      const salt = await bcrypt.genSalt();
      const updatedPasswordHash = await bcrypt.hash(value, salt);
      updateFields.push(`${columnMappings[key]} = ?`);
      updateValues.push(updatedPasswordHash);
    } else {
      updateFields.push(`${columnMappings[key]} = ?`);
      updateValues.push(value);
    }
  }

  const updateQuery = `UPDATE GLO_USUARIOS SET ${updateFields.join(
    ", "
  )} WHERE USUARIO_IN_ID = ?`;
  const updateParams = [...updateValues, id];

  const [response] = await db.query(updateQuery, updateParams);

  return response;
};

const deleteUserQuery = `DELETE FROM 
    GLO_USUARIOS 
  WHERE 
    USUARIO_IN_ID = ?`;

export const deleteUser = async (id) => {
  const [response] = await db.query(deleteUserQuery, [id]);

  return response;
};
