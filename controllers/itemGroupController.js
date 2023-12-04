import * as ItemGroup from "../models/ItemGroup.js";

export const getAllItemGroup = async (req, res) => {
  try {
    const getItemGroup = await ItemGroup.getAllItemGroup();

    res.status(200).json(getItemGroup);
  } catch (error) {
    console.log("Erro ao encontrar os grupos de itens", error);
  }
};

export const createItemGroup = async (req, res) => {
  try {
    const { name, description, depreciation } = req.body;

    if (!name || !description || !depreciation) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const itemGroup = {
      name,
      description,
      depreciation
    };

    await ItemGroup.createItemGroup(itemGroup);
    res
      .status(201)
      .json({msg: "Grupo de itens criado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error });
    console.log({error: error})
  }
};

export const updateItemGroup = async (req, res) => {
  try {
    const { name, description, depreciation, active } = req.body;

    const { id } = req.params;
    // const itemGroup = await ItemGroup.findById(id).exec();
    // if (!itemGroup) {
    //   res.status(204).json({ msg: `Nenhum grupo de itens com esse ID` });
    // }
    const response = {
      name,
      description,
      depreciation,
      active,
    }; 
     await ItemGroup.updateItemGroup(id, response);
      res
        .status(201)
        .json({msg: "Grupo de itens atualizado com sucesso!" });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Erro interno no servidor."})
  }
};

export const deleteItemGroup = async (req, res) => {
  try {
    const { id } = req.params;
    // const itemGroup = await ItemGroup.findById(id).exec();
    // if (!itemGroup) {
    //   res.status(204).json({ msg: `Nenhum centro de custo com esse ID` });
    // }
    await ItemGroup.deleteItemGroup(id);
    res 
      .status(200)
      .json({msg: "Grupo de itens deletado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({error: "Erro interno do servidor."})
  }
};
