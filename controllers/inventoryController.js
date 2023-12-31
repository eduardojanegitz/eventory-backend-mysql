import {
  addItemToInventory,
  getAllInventories,
  getAllItemsInventories,
  openInventory,
  finalizeInventory,
  checkItemsLocationMatch,
  deleteItemInventory,
} from "../models/Inventory.js";
import { getItemById, getItemByLocation } from "../models/Item.js";

export const createItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    await addItemToInventory(itemId);

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
    const { id } = req.params;
    const inventoryItem = await getAllItemsInventories(id);

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
    const { location, observation, cost, user } = req.body;

    await openInventory({
      location,
      observation,
      cost,
      user,
    });

    res.status(201).json({ msg: "Inventário iniciado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const finalize = async (req, res) => {
  try {
    const { inventoryId } = req.body;

    const itemsLocationMatch = await checkItemsLocationMatch(inventoryId);
    if (!itemsLocationMatch) {
      return res.status(400).json({
        error:
          "Divergência encontrada na localização do inventário. Verifique os itens lidos na tela de Divergências.",
      });
    }

    await finalizeInventory(inventoryId);

    res.status(200).json({ msg: "Inventário finalizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao finalizar inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteItemFromInventory = async (req, res) => {
  try {
    const { id, inventoryId } = req.body;

    // Verifica se o item de inventário existe antes de tentar excluí-lo
    const inventoryItems = await getAllItemsInventories(inventoryId);
    const itemExists = inventoryItems.some((item) => item.ITEM_IN_ID === id);

    // console.log(itemExists)

    if (!itemExists) {
      return res.status(404).json({ error: "Nenhum item encontrado com esse código no inventário." });
    }

    // Exclui o item de inventário
    await deleteItemInventory(id, inventoryId);

    res.status(200).json({ msg: "Item excluído do inventário com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir item do inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};