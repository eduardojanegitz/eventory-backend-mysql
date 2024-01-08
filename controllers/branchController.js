import {
  getAllBranches,
  createBranch,
  updateBranch,
  getBranchById,
  inactivateBranch,
  activateBranch,
  getAllActiveBranches,
} from "../models/Branch.js";

export const allBranches = async (req, res) => {
  try {
    const allBranches = await getAllBranches();

    if (allBranches.length === 0) {
      return res.status(204);
    }

    res.status(200).json(allBranches);
  } catch (error) {
    console.error("Erro ao buscar as filiais:", error);
    res.status(500).json({ error: error.message });
  }
};

export const activeBranches = async (req, res) => {
  try {
    const activeBranches = await getAllActiveBranches();

    if (activeBranches.length === 0) {
      return res.status(204);
    }

    res.status(200).json(activeBranches);
  } catch (error) {
    console.error("Erro ao buscar as filiais:", error);
    res.status(500).json({ error: error.message });
  }
};

export const newBranch = async (req, res) => {
  try {
    const { name, description } = req.body;

    const requiredFields = ["name", "description"];
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
    const response = {
      name,
      description,
    };

    await createBranch(response);
    res.status(201).json({ msg: "Filial registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar filial: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const editBranch = async (req, res) => {
  try {
    const { name, description } = req.body;

    const { id } = req.params;

    const branchExists = await getBranchById(id);
    if (!branchExists) {
      return res
        .status(404)
        .json({ error: `Nenhuma filial encontrada com esse código: ${id}` });
    }

    const response = {
      name,
      description,
    };

    await updateBranch(id, response);
    res.status(200).json({ msg: "Filial atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const activateBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const branchExists = await getBranchById(id);
    if (!branchExists) {
      return res
        .status(404)
        .json({ error: `Nenhuma filial encontrada com o código: ${id}` });
    }

    await activateBranch(id);
    res.status(200).json({ msg: "Filial ativada com sucesso!" });
  } catch (error) {
    console.error("Erro ao ativar filial:", error);
    res.status(500).json({ error: error.message });
  }
};

export const inactivateBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const branchExists = await getBranchById(id);
    if (!branchExists) {
      return res
        .status(404)
        .json({ error: `Nenhuma filial encontrada com o código: ${id}` });
    }

    await inactivateBranch(id);
    res.status(200).json({ msg: "Filial inativada com sucesso!" });
  } catch (error) {
    console.error("Erro ao inativar filial:", error);
    res.status(500).json({ error: error.message });
  }
};
