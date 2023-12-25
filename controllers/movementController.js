import * as Movement from "../models/Movement.js";
import { getItemById } from "../models/Item.js";
import { getLocationById } from "../models/Location.js";

export const getAll = async (req, res) => {
  try {
    const getMovement = await Movement.getAllMovement();
    res.status(200).json(getMovement);
  } catch (error) {
    console.error("Erro ao buscar movimentações:", error);
    res.status(500).json({ message: "Erro interno do servidor: ", error });
  }
};

export const createMovement = async (req, res) => {
  try {
    const { item, newLocation, reason, observations } = req.body;

    const requiredFields = ["item", "newLocation", "reason"];
    const missingFields = [];

    requiredFields.forEach((field) => {
      if (!req.body[field]) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${missingFields.join(", ")}.`,
      });
    }

    const itemExists = await getItemById(item);
    if (!itemExists) {
      return res.status(404).json({
        error: "Nenhum item encontrado com esse código! Forneça um ID válido.",
      });
    }

    const locationExists = await getLocationById(newLocation);
    if (!locationExists) {
      return res.status(404).json({
        error: "Nenhuma localização encontrada! Forneça um ID válido.",
      });
    }
    
    const movement = {
      item,
      newLocation,
      reason,
      observations,
      user: req.id 
    };

    await Movement.createMovement(movement);
    res.status(201).json({ msg: "Movimentação realizada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json("Erro interno do servidor: ", error);
  }
};
