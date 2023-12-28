import * as userModel from "../models/User.js";

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.getUserById(id);

    if (!user) {
      res.status(404).json({ error: "Nenhum usuário encontrado com esse ID!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();

    if (users.length === 0) {
      return res.status(204).json({ msg: "Nenhum usuário encontrado!" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Erro na requisição do usuário: ", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, password, name, email, department, roles } = req.body;

    const requiredFields = [
      "username",
      "password",
      "name",
      "email",
      "department",
      "roles",
    ];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(", ")}`,
      });
    }

    const userExists = await userModel.getUserByUsername(username);
    if (userExists) {
      return res.status(400).json({
        error:
          "Usuário já cadastrado. Por favor, escolha outro nome de usuário.",
      });
    }

    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      return res.status(400).json({
        error:
          "A senha precisa ter no mínimo 8 caracteres, ser alfanumérica e conter pelo menos uma letra maiúscula.",
      });
    }

    const userData = {
      username,
      password,
      name,
      email,
      department,
      roles,
    };

    await userModel.createUser(userData);

    res.status(201).json({ msg: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error({ error: error });
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, name, email, password, department, roles, active } =
      req.body;
    const { id } = req.params;

    const userExists = await userModel.getUserById(id);
    if (!userExists) {
      return res
        .status(404)
        .json({ error: "Nenhum usuário encontrado com esse ID!" });
    }

    if (
      password.length < 8 ||
      !/\d/.test(password) ||
      !/[A-Z]/.test(password)
    ) {
      return res.status(400).json({
        error:
          "A senha precisa ter no mínimo 8 caracteres, ser alfanumérica e conter pelo menos uma letra maiúscula.",
      });
    }

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
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await userModel.getUserById(id);
    if (!userExists) {
      return res
        .status(404)
        .json({ error: "Nenhum usuário encontrado com esse ID!" });
    }

    await userModel.deleteUser(id);

    res.status(200).json({ msg: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
