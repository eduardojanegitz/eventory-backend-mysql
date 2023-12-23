import db from "../config/db.js";
import bcrypt from "bcrypt";

const selectUserByIdQuery =
  "SELECT * FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?";
const selectUsersQuery =
  "SELECT USUARIO_IN_ID as _id, USUARIO_ST_ALTERNATIVO as username, USUARIO_ST_NOME as name, USUARIO_ST_EMAIL as email, USUARIO_ST_DEPARTAMENTO as department, USUARIO_ST_PERMISSAO as roles, DATE_FORMAT(USUARIO_DT_CRIACAO, '%d/%m/%Y %H:%i:%s') AS createdAt FROM GLO_USUARIOS WHERE USUARIO_CH_ATIVO = 'S'";
const selectUserByUsernameQuery =
  "SELECT USUARIO_ST_ALTERNATIVO, USUARIO_ST_NOME, USUARIO_ST_EMAIL, USUARIO_ST_DEPARTAMENTO, USUARIO_ST_PERMISSAO FROM GLO_USUARIOS WHERE USUARIO_ST_ALTERNATIVO = ?";

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
    "INSERT INTO GLO_USUARIOS (USUARIO_ST_ALTERNATIVO, USUARIO_ST_SENHA, USUARIO_ST_NOME, USUARIO_ST_EMAIL, USUARIO_ST_DEPARTAMENTO, USUARIO_ST_PERMISSAO) VALUES (?, ?, ?, ?, ?, ?)",
    [username, passwordHash, name, email, department, roles]
  );

  return response;
};

const updateUserQuery =
  "UPDATE GLO_USUARIOS SET USUARIO_ST_ALTERNATIVO = ?, USUARIO_ST_NOME = ?, USUARIO_ST_EMAIL = ?, USUARIO_ST_SENHA = ?, USUARIO_ST_DEPARTAMENTO = ?, USUARIO_ST_PERMISSAO = ?, USUARIO_CH_ATIVO = ? WHERE USUARIO_IN_ID = ?";

export const updateUser = async (id, userData) => {
  const { username, name, email, password, department, roles, active } =
    userData;

  const [user] = await db.query(selectUserByIdQuery, [id]);

  if (user.length === 0) {
    throw new Error("Nenhum usuário encontrado com esse ID!");
  }

  let updatedPasswordHash = user[0].password;

  if (password) {
    const salt = await bcrypt.genSalt();
    updatedPasswordHash = await bcrypt.hash(password, salt);
  }

  const [response] = await db.query(updateUserQuery, [
    username,
    name,
    email,
    updatedPasswordHash,
    department,
    roles,
    active,
    id,
  ]);

  return response;
};

const deleteUserQuery = "DELETE FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?";

export const deleteUser = async (id) => {
  const [user] = await db.query(selectUserByIdQuery, [id]);

  if (user.length === 0) {
    throw new Error("Nenhum usuário encontrado com esse ID!");
  }

  const [response] = await db.query(deleteUserQuery, [id]);

  return response;
};
