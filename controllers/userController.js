import * as userModel from "../models/User.js";


export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      res.status(404).json({ msg: "Usuário não encontrado!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    if (!users) {
      res.status(404).json({ msg: "Nenhum usuário encontrado" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro na requisição do usuário", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, department, roles } = req.body;

    const existingUser = await userModel.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Usuário já existente." });
    }

    const response = {
      username,
      password,
      name,
      email,
      department,
      roles,
    };

    if (password.length < 8) {
      res
        .status(400)
        .json({ error: "A senha precisa ter no mínimo 8 caracteres." });
    }

    await userModel.createUser(response);

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error({ error: error });
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, name, email, password, department, roles, active } =
      req.body;
    const { id } = req.params;

    const response = {
      username,
      name,
      email,
      password,
      department,
      roles,
      active,
    };

    await userModel.updateUser(id, response);

    res.status(200).json({ msg: "Usuário atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await userModel.deleteUser(id);

    res.status(200).json({ msg: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
