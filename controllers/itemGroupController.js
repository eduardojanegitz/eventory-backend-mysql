import * as ItemGroup from "../models/ItemGroup.js";

export const getAllItemGroup = async (req, res) => {
  try {
    const itemGroup = await ItemGroup.getAllItemGroup();

    if (itemGroup.length === 0) {
      return res.status(204);
    }

    res.status(200).json(itemGroup);
  } catch (error) {
    console.log("Erro ao encontrar os grupos de itens: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const createItemGroup = async (req, res) => {
  try {
    const { name, description, depreciation } = req.body;

    const requiredFields = ["name", "description", "depreciation"];
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

    const itemGroup = {
      name,
      description,
      depreciation,
    };

    await ItemGroup.createItemGroup(itemGroup);
    res.status(201).json({ msg: "Grupo de itens criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Erro ao criar o grupo de itens: ", error);
  }
};

export const updateItemGroup = async (req, res) => {
  try {
    const { name, description, depreciation, active } = req.body;

    const { id } = req.params;

    const itemGroupExists = await ItemGroup.getItemGroupById(id);
    if (!itemGroupExists) {
      return res.status(404).json({
        error: "Nenhum grupo de itens encontrado! Forneça um ID válido.",
      });
    }

    const response = {
      name,
      description,
      depreciation,
      active,
    };

    await ItemGroup.updateItemGroup(id, response);
    res.status(200).json({ msg: "Grupo de itens atualizado com sucesso!" });
  } catch (error) {
    console.log("Erro ao atualizar o grupo de itens: ", error);
    res.status(500).json({ error: error.message });
  }
};

