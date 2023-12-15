import db from "../config/db.js";
import bcrypt from "bcrypt";

export const getUserById = async (id) => {
  const [user] = await db.query(
    "SELECT * FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?",
    [id]
  );
  return user[0];
};

export const getAllUsers = async () => {
  const [users] = await db.query(
    "SELECT GU.USUARIO_ST_ALTERNATIVO, GU.USUARIO_ST_NOME, GU.USUARIO_ST_EMAIL, GU.USUARIO_ST_DEPARTAMENTO, GU.USUARIO_ST_PERMISSAO FROM GLO_USUARIOS GU"
  );
  return users;
};

export const getUserByUsername = async (username) => {
  const [user] = await db.query(
    "SELECT GU.USUARIO_ST_ALTERNATIVO, GU.USUARIO_ST_NOME, GU.USUARIO_ST_EMAIL, GU.USUARIO_ST_DEPARTAMENTO, GU.USUARIO_ST_PERMISSAO FROM GLO_USUARIOS GU WHERE GU.USUARIO_ST_ALTERNATIVO = ?",
    [username]
  );
  return user[0];
};

export const createUser = async (userData) => {
  const { username, password, name, email, department, roles } = userData;

  if (existingUser.length > 0) {
    throw new Error("A conta com esse username já existe!");
  }

  // password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);
  //PACKAGE
  const [response] = await db.query(
    "INSERT INTO GLO_USUARIOS (USUARIO_ST_ALTERNATIVO, USUARIO_ST_SENHA, USUARIO_ST_NOME, USUARIO_ST_EMAIL, USUARIO_ST_DEPARTAMENTO, USUARIO_ST_PERMISSAO) VALUES (?, ?, ?, ?, ?, ?)",
    [username, passwordHash, name, email, department, roles]
  );

  return response;
};

export const updateUser = async (id, userData) => {
  const { username, name, email, password, department, roles, active } =
    userData;

  const [user] = await db.query(
    "SELECT * FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?",
    [id]
  );

  if (user.length === 0) {
    throw new Error("Nenhum usuário encontrado com esse ID!");
  }

  let updatedPasswordHash = user[0].password;

  if (password) {
    const salt = await bcrypt.genSalt();
    updatedPasswordHash = await bcrypt.hash(password, salt);
  }
  /* CRIAR UMA PACKAGE*/
  const [response] = await db.query(
    "UPDATE GLO_USUARIOS SET USUARIO_ST_ALTERNATIVO = ?, USUARIO_ST_NOME = ?, USUARIO_ST_EMAIL = ?, USUARIO_ST_SENHA = ?, USUARIO_ST_DEPARTAMENTO = ?, USUARIO_ST_PERMISSAO = ?, USUARIO_CH_ATIVO = ? WHERE USUARIO_IN_ID = ?",
    [username, name, email, updatedPasswordHash, department, roles, active, id]
  );

  return response;
};

export const deleteUser = async (id) => {
  const [user] = await db.query(
    "SELECT * FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?",
    [id]
  );

  if (user.length === 0) {
    throw new Error("Nenhum usuário encontrado com esse ID!");
  }

  const [response] = await db.query(
    "DELETE FROM GLO_USUARIOS WHERE USUARIO_IN_ID = ?",
    [id]
  );

  return response;
};
