import * as Cost from "../models/Cost.js";

export const getAllCost = async (req, res) => {
  try {
    const getCostCenter = await Cost.getAllCostCenter();
    res.status(200).json(getCostCenter);
  } catch (error) {
    console.error("Erro ao buscar os centros de custo:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const createCost = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    await Cost.createCostCenter({ name, description });
    res.status(201).json({ msg: "Centro de custo criado com sucesso!" });
  } catch (error) {
    res.status(500).json("Erro interno no servidor: ", error);
    console.error("Erro ao criar o centro de custo: ", error);
  }
};

export const updateCost = async (req, res) => {
  try {
    const { name, description, active } = req.body;
    const { id } = req.params;
    // const cost = await Cost.findById(id).exec();
    // if (!cost) {
    //   res.status(204).json({ msg: `Nenhum centro de custo com esse ID` });
    // }
    const response = {
      name,
      description,
      active,
    };
    await Cost.updateCostCenter(id, response);
    res
      .status(201)
      .json({ response, msg: "Centro de custo atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCost = async (req, res) => {
  try {
    const { id } = req.params;
    const cost = await Cost.findById(id).exec();
    if (!cost) {
      res.status(204).json({ msg: `Nenhum centro de custo com esse ID` });
    }
    const response = await cost.deleteOne();
    res
      .status(200)
      .json({ response, msg: "Centro de custo deletado com sucesso!" });
  } catch (error) {
    console.log(error);
  }
};
