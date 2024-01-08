import * as Item from "../models/Item.js";

export const getAllItems = async (req, res) => {
  try {
    const item = await Item.getAllItems();

    if (item.length === 0) {
      return res.status(204);
    }

    res.status(200).json(item);
  } catch (error) {
    console.log("Erro ao realizar a consulta: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getItemByTag = async (req, res) => {
  try {
    const tag = req.params.tag;

    const itemTagExists = await Item.getItemByTag(tag);
    if (!itemTagExists) {
      return res.status(404).json({
        error:
          "Não existe nenhum item com esse número de patrimônio cadastrado.",
      });
    }

    res.status(200).json(itemTagExists);
  } catch (error) {
    console.log("Erro em encontrar o item: ", error);
    res.statu(500).json({ error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const {
      branch,
      name,
      description,
      value,
      responsable,
      location,
      supplier,
      serialNumber,
      tag,
      acquisitionDate,
      itemGroup,
      costCenter,
      invoice,
    } = req.body;

    const requiredFields = [
      "branch",
      "name",
      "description",
      "value",
      "responsable",
      "location",
      "supplier",
      "serialNumber",
      "tag",
      "acquisitionDate",
      "itemGroup",
      "costCenter",
      "invoice",
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

    const itemTagExists = await Item.getItemByTag(tag);
    if (itemTagExists) {
      return res.status(400).json({
        error: "Já exixte um item com esse número de patrimônio cadastrado!",
      });
    }

    const item = {
      branch,
      name,
      description,
      value,
      responsable,
      location,
      supplier,
      serialNumber,
      tag,
      acquisitionDate,
      itemGroup,
      costCenter,
      invoice,
    };

    await Item.createItem(item);
    res.status(201).json({ msg: "Item criado com sucesso!" });
  } catch (error) {
    console.log("Erro ao criar o item: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const {
      branch,
      name,
      description,
      value,
      responsable,
      serialNumber,
      writeOffDate,
      tag,
      acquisitionDate,
      itemGroup,
      costCenter,
      active,
      supplier,
    } = req.body;

    const { id } = req.params;
    const itemExists = await Item.getItemById(id);
    if (!itemExists) {
      return res.status(404).json({
        error: `Nenhum item encontrado com esse código! Forneça um ID válido.`,
      });
    }

    const itemTagExistsByTag = await Item.getItemByTag(tag);
    if (itemTagExistsByTag) {
      return res.status(400).json({
        error: "Já exixte um item com esse número de patrimônio cadastrado!",
      });
    }

    const response = {
      branch,
      name,
      description,
      value,
      responsable,
      serialNumber,
      writeOffDate,
      tag,
      acquisitionDate,
      itemGroup,
      costCenter,
      active,
      supplier,
    };

    await Item.updateItem(id, response);
    res.status(201).json({ msg: "Item atualizado com sucesso!" });
  } catch (error) {
    console.log("Erro ao atualizar o item: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadItemImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id).exec();
    if (!item) {
      res.status(404).json({ msg: "Item não encontrado" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ msg: "Nenhuma imagem foi enviada" });
      return;
    }

    item.image.data = req.file.buffer;
    item.image.contentType = req.file.mimetype;

    await item.save();

    res.status(200).json({ msg: "Imagem do item atualizada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Erro interno do servidor" });
  }
};

export const activateItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const itemExists = await Item.getItemById(id);
    if (!itemExists) {
      return res
        .status(404)
        .json({ error: `Nenhum item encontrado com o código: ${id}` });
    }

    await Item.activateItem(id);
    res.status(200).json({ msg: "Item ativado com sucesso!" });
  } catch (error) {
    console.error("Erro ao ativar item:", error);
    res.status(500).json({ error: error.message });
  }
};

export const inactivateItemById = async (req, res) => {
  try {
    const { id } = req.params;

    const itemExists = await Item.getItemById(id);
    if (!itemExists) {
      return res
        .status(404)
        .json({ error: `Nenhum item encontrado com o código: ${id}` });
    }

    await Item.inactivateItem(id);
    res.status(200).json({ msg: "Item inativado com sucesso!" });
  } catch (error) {
    console.error("Erro ao inativar item:", error);
    res.status(500).json({ error: error.message });
  }
};

export const writeOff = async (req, res) => {
  try {
    const { writeOffDate } = req.body;
    const { id } = req.params;

    const itemExists = await Item.getItemById(id);
    if (!itemExists) {
      return res
        .status(404)
        .json({ error: `Nenhum item encontrado com o código: ${id}` });
    }

    await Item.writeOffItem(writeOffDate, id);
    res.status(200).json({ msg: "Item dado baixa com sucesso!" });
  } catch (error) {
    console.error("Erro ao dar baixa no item:", error);
    res.status(500).json({ error: error.message });
  }
};
