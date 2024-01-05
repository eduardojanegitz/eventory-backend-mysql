import {
  addItemToInventory,
  getAllInventories,
  getAllItemsInventories,
  openInventory,
  finalizeInventory,
  checkItemsLocationMatch,
  deleteItemInventory,
  isItemInInventory,
} from "../models/Inventory.js";
import { getItemByLocation } from "../models/Item.js";

export const createItem = async (req, res) => {
  try {
    const { itemId, inventoryId } = req.body;

    const requiredFields = [
      "itemId",
      "inventoryId",
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

    const isItemAlreadyInInventory = await isItemInInventory(itemId, inventoryId);

    if (isItemAlreadyInInventory) {
      return res.status(400).json({ error: "Não pode ser lido o mesmo item duas vezes!" });
    }

    await addItemToInventory(itemId, inventoryId);

    res.status(201).json({ msg: "Item adicionado ao inventário com sucesso!" });
  } catch (error) {
    console.error("Erro ao adicionar item ao inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllInventory = async (req, res) => {
  try {
    const getInventory = await getAllInventories();
    res.status(200).json(getInventory);
  } catch (error) {
    console.error("Erro na consulta dos inventários:", error);
    res.status(500).json({ error: "Erro ao buscar inventários" });
  }
};

export const getAllItemInventories = async (req, res) => {
  try {
    const { itemId } = req.params;
    const inventoryItem = await getAllItemsInventories(itemId);

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Erro na consulta dos itens de inventários: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemByLocation = async (req, res) => {
  try {
    const location = req.params.location;

    const getItem = await getItemByLocation(location);
    res.status(200).json(getItem);
  } catch (error) {
    console.error("Erro ao buscar itens por localização:", error);
    res.status(500).json({ error: "Erro ao buscar itens por localização" });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { location, costCenter } = req.body;

    const requiredFields = [
      "location",
      "costCenter"
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

    const response = await openInventory({
      location,
      // observation,
      costCenter,
      user: req.id,
    });

    res.status(201).json({ inventoryId: response, msg: "Inventário iniciado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const finalize = async (req, res) => {
  try {
    const { inventoryId, observation } = req.body;

    const itemsLocationMatch = await checkItemsLocationMatch(inventoryId);
    if (!itemsLocationMatch) {
      return res.status(400).json({
        error:
          "Divergência encontrada na localização do inventário. Verifique os itens lidos na tela de Divergências.",
      });
    }

    await finalizeInventory(inventoryId, observation);

    res.status(200).json({ msg: "Inventário finalizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao finalizar inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteItemFromInventory = async (req, res) => {
  try {
    const { itemId, inventoryId } = req.params;

    const inventoryItems = await getAllItemsInventories(inventoryId);
    const itemExists = inventoryItems.some((item) => item.itemId === Number(itemId));

    if (!itemExists) {
      return res.status(404).json({ error: "Nenhum item encontrado com esse código no inventário." });
    }

    await deleteItemInventory(itemId, inventoryId);

    res.status(200).json({ msg: "Item excluído do inventário com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir item do inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};