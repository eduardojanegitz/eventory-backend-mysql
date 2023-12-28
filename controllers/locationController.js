import * as Location from "../models/Location.js";

export const getAll = async (req, res) => {
  try {
    const getLocation = await Location.getAllLocation();
    res.status(200).json(getLocation);
  } catch (error) {
    console.error("Erro ao buscar as localizações: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    const requiredFields = ["name"];
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

    const location = {
      name,
      description,
    };

    await Location.createLocation(location);
    res.status(201).json({ msg: "Localização registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar localização: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { name, description, active } = req.body;

    const { id } = req.params;
    const response = {
      name,
      description,
      active,
    };

    const locationExists = await Location.getLocationById(id);
    if (!locationExists) {
      return res.status(404).json({
        error: "Nenhuma localização encontrada! Forneça um ID válido.",
      });
    }

    await Location.updateLocation(id, response);
    res.status(201).json({ msg: "Localização atualizada com sucesso!" });
  } catch (error) {
    console.log("Erro ao atualizar a localização: ", error);
    res.status(500).json({ error: error.message });
  }
};
