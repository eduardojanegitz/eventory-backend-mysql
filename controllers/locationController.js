import * as Location from "../models/Location.js";

export const getAll = async (req, res) => {
  try {
    const getLocation = await Location.getAllLocation();
    res.status(200).json(getLocation);
  } catch (error) {
    console.error("Erro ao buscar as localizações:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const location = {
      name,
      description,
    };

    const response = await Location.createLocation(location);
    res.status(201).json({ msg: "Localização registrada com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar localização:", error);
    res.status(500).json("Erro interno do servidor:", error);
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
    // const location = await Location.findById(id).exec();
    // if (!location) {
    //   res.status(204).json({ msg: `Nenhuma localização encontrada com esse ID!` });
    // }
    await Location.updateLocation(id, response);
    res.status(201).json({ msg: "Localização atualizada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    // const location = await Location.findById(id).exec();
    // if (!location) {
    //   res.status(204).json({ msg: `Nenhuma localização encontrada!` });
    // }
    await Location.deleteLocation(id);
    res.status(200).json({ msg: "Localização deletada com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir localização:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
