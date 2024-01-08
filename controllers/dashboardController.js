import {
  getAllItems,
  getItemAvarageAge,
  getItemByCostCenter,
  getItemsTotalValue,
  getItemsTotalValueInYear,
  getItemByItemGroup,
  getPercentageLastMonth
} from "../models/Dashboard.js";

export const allItems = async (req, res) => {
  try {
    const allItems = await getAllItems();

    if (allItems.length === 0) {
      res.status(204);
    }

    res.status(200).json(allItems);
  } catch (error) {
    console.error("Erro ao buscar a quantidade total de itens: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemsTotalValue = async (req, res) => {
  try {
    const totalValue = await getItemsTotalValue();

    if (totalValue.length === 0) {
      res.status(204);
    }

    res.status(200).json(totalValue);
  } catch (error) {
    console.error("Erro ao buscar o valor total dos itens: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const percentageLastMonth = async (req, res) => {
  try {
    const percentageLastMonth = await getPercentageLastMonth();

    if (percentageLastMonth.length === 0) {
      res.status(204);
    }

    res.status(200).json(percentageLastMonth);
  } catch (error) {
    console.error("Erro ao buscar a porcentagem dos itens com referência ao mês anterior: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemsTotalValueInYear = async (req, res) => {
  try {
    const totalValueInYear = await getItemsTotalValueInYear();

    if (totalValueInYear.length === 0) {
      res.status(204);
    }

    res.status(200).json(totalValueInYear);
  } catch (error) {
    console.error("Erro ao buscar o valor total dos itens no ano: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemAvarageAge = async (req, res) => {
  try {
    const itemAvarageAge = await getItemAvarageAge();

    if (itemAvarageAge.length === 0) {
      res.status(204);
    }

    res.status(200).json(itemAvarageAge);
  } catch (error) {
    console.error("Erro ao buscar o valor total dos itens no ano: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemByCostCenter = async (req, res) => {
  try {
    const itemByCostCenter = await getItemByCostCenter();

    if (itemByCostCenter.length === 0) {
      res.status(204);
    }

    res.status(200).json(itemByCostCenter);
  } catch (error) {
    console.error("Erro ao buscar o item por centro de custo: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const itemByItemGroup = async (req, res) => {
  try {
    const itemByItemGroup = await getItemByItemGroup();

    if (itemByItemGroup.length === 0) {
      res.status(204);
    }

    res.status(200).json(itemByItemGroup);
  } catch (error) {
    console.error("Erro ao buscar o item por centro de custo: ", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllInventory = {
  getAll: async (req, res) => {
    try {
      const getInventory = await Transaction.find();

      res.status(200).json(getInventory);
    } catch (error) {
      console.log("erro na consulta dos inventários", error);
    }
  },
};

export const postInventoriedItem = {
  create: async (req, res) => {
    try {
      const item = {
        location: req.body.location,
        responsable: req.body.responsable,
        item: req.body.item,
      };

      const response = await Transaction.create(item);
      res.status(201).json({ response, msg: "Item inventariado com sucesso" });
    } catch (error) {
      console.log(error);
    }
  },
};

export const totalValue = async (req, res) => {
  try {
    const countVal = await Item.aggregate([
      {
        $group: {
          _id: { id: "_id" },
          total: { $sum: "$value" },
        },
      },
    ]);

    res.status(200).json(countVal);
  } catch (error) {
    console.log(error);
  }
};

export const totalValueByYear = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const totalValueByYear = await Item.aggregate([
      {
        $addFields: {
          createdAt: { $toDate: "$acquisitionDate" },
        },
      },
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$acquisitionDate" },
          },
          total: { $sum: "$value" },
        },
      },
    ]);

    res.status(200).json(totalValueByYear);
  } catch (error) {
    console.log("Erro interno no servidor.", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

export const getItemsFromLastMonth = async (req, res) => {
  try {
    const today = new Date();

    const firstDayActualMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    firstDayActualMonth.setHours(0, 0, 0, 0);

    const firstDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    firstDayLastMonth.setMonth(firstDayLastMonth.getMonth() - 1);
    firstDayLastMonth.setHours(0, 0, 0, 0);

    const itemsLastMonth = await Item.find({
      createdAt: {
        $gte: firstDayLastMonth,
        $lt: firstDayActualMonth,
      },
    });

    if (itemsLastMonth.length === 0) {
      res.status(204).json("0");
    } else {
      res.status(200).json(itemsLastMonth);
    }
  } catch (error) {
    console.log("Erro em encontrar os itens do mês anterior", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};
