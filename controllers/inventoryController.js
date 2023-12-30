import * as Inventory from "../models/Inventory.js";
import * as Item from "../models/Item.js";

export const getAllInventory = async (req, res) => {
  try {
    const getInventory = await Inventory.getAllInventories();
    res.status(200).json(getInventory);
  } catch (error) {
    console.error("Erro na consulta dos inventários:", error);
    res.status(500).json({ error: "Erro ao buscar inventários" });
  }
};

export const getAllItemInventories = async (req, res) => {
  try {
    const { id } = req.params;
    const inventoryItem = await Inventory.getAllItemsInventories(id);

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Erro na consulta dos itens de inventários: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getItemByLocation = async (req, res) => {
  try {
    const location = req.params.location;

    const getItem = await Item.getItemByLocation(location);
    res.status(200).json(getItem);
  } catch (error) {
    console.error("Erro ao buscar itens por localização:", error);
    res.status(500).json({ error: "Erro ao buscar itens por localização" });
  }
};

export const createInventory = async (req, res) => {
  try {
    const { location, observation, user, items } = req.body;

    const itemsLocationMatch = await Inventory.checkItemsLocationMatch(
      location,
      items,
      user
    );

    if (!itemsLocationMatch) {
      return res.status(400).json({
        error:
          "Divergência encontrada na localização do inventário. Verifique os itens lidos na tela de Divergências.",
      });
    }

    const inventoryData = {
      location,
      observation,
      user,
      items,
    };

    await Inventory.createInventory(inventoryData);

    res.status(201).json({ msg: "Inventário realizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar inventário: ", error);
    res.status(500).json({ error: error.message });
  }
};
