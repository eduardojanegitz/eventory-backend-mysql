import * as Item from "../models/Item.js";
import * as Movement from "../models/Movement.js";

export const getAll = async (req, res) => {
  try {
    const getMovement = await Movement.getAllMovement();
    res.status(200).json(getMovement);
  } catch (error) {
    console.error("Erro ao buscar movimentos:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const createMovement = async (req, res) => {
  try {
    const { item, newLocation, reason, observations, user } =
      req.body;

    if (!item || !newLocation || !reason || !observations) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    // const itemId = req.body.id;

    // const item = await Item.findByIdAndUpdate(itemId, {
    //   location: newLocation,
    // });

    // if (!item) {
    //   return res.status(404).json({ message: "Item não encontrado." });
    // }

    const movement = {
      item,
      newLocation,
      reason,
      observations,
      user,
    };

    await Movement.createMovement(movement);
    res.status(201).json({ msg: "Movimento registrado com sucesso!" });
  } catch (error) {
    console.error(error)
    res.status(500).json("Erro interno do servidor:", error);
  }
};
