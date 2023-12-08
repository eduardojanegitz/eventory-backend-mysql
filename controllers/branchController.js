import * as Branch from "../models/Branch.js";

export const getAll = async (req, res) => {
  try {
    const getBranch = await Branch.getAllBranches();
    res.status(200).json(getBranch);
  } catch (error) {
    console.error("Erro ao buscar as filiais:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const createBranch = async (req, res) => {
  try {
    const { branch, description } = req.body;

    if (!branch || !description) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const response = {
      branch,
      description,
    };

    await Branch.createBranch(response);
    res.status(201).json({ msg: "Filial registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar filial:", error);
    res.status(500).json("Erro interno do servidor:", error);
  }
};

export const updateBranch = async (req, res) => {
  try {
    const response = req.body;

    const { id } = req.params;

    
    // const location = await Location.findById(id).exec();
    // if (!location) {
    //   res.status(204).json({ msg: `Nenhuma localização encontrada com esse ID!` });
    // }
    await Branch.updateBranch(id, response);
    res.status(200).json({ msg: "Filial atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    // const location = await Location.findById(id).exec();
    // if (!location) {
    //   res.status(204).json({ msg: `Nenhuma localização encontrada!` });
    // }
    await Branch.deleteBranch(id);
    res.status(200).json({ msg: "Filial deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir filial:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
