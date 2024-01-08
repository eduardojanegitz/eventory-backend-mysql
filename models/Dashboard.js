import db from "../config/db.js";

export const getAllItems = async () => {
  const [items] = await db.query(`
  SELECT 
    COUNT(*) AS QUANTIDADE
  FROM 
    EST_ITENS 
  WHERE 
    ITEM_CH_ATIVO = 'S'
  `);
  return items[0];
};

export const getItemsTotalValue = async () => {
  const [totalValue] = await db.query(`
  SELECT 
    CONCAT('R$ ', FORMAT(SUM(ITEM_DC_VALOR), 2, 'de_De')) AS totalValue
  FROM 
    EST_ITENS 
  WHERE 
    ITEM_CH_ATIVO = 'S'
  `);

  return totalValue[0];
};

export const getPercentageLastMonth = async () => {
  const [percentageLastMonth] = await db.query(`
  SELECT
    CONCAT(YEAR(I.ITEM_DT_AQUISICAO), LPAD(MONTH(I.ITEM_DT_AQUISICAO), 2, '0')) AS yearMonth,
    COUNT(I.ITEM_IN_ID) AS totalItems,
    LAG(COUNT(I.ITEM_IN_ID)) OVER (ORDER BY YEAR(I.ITEM_DT_AQUISICAO), MONTH(I.ITEM_DT_AQUISICAO)) AS totalItemsLastMonth,
    CASE
      WHEN LAG(COUNT(I.ITEM_IN_ID)) OVER (ORDER BY YEAR(I.ITEM_DT_AQUISICAO), MONTH(I.ITEM_DT_AQUISICAO)) = 0 THEN '100%'
      ELSE CONCAT(ROUND(((COUNT(I.ITEM_IN_ID) - LAG(COUNT(I.ITEM_IN_ID)) OVER (ORDER BY YEAR(I.ITEM_DT_AQUISICAO), MONTH(I.ITEM_DT_AQUISICAO))) / LAG(COUNT(I.ITEM_IN_ID)) OVER (ORDER BY YEAR(I.ITEM_DT_AQUISICAO), MONTH(I.ITEM_DT_AQUISICAO))) * 100, 2), '%')
    END AS percentage
  FROM
    EST_ITENS I
  WHERE
    CONCAT(YEAR(I.ITEM_DT_AQUISICAO), LPAD(MONTH(I.ITEM_DT_AQUISICAO), 2, '0')) >= CONCAT(YEAR(CURRENT_DATE) - 1, LPAD(MONTH(CURRENT_DATE), 2, '0'))
    AND CONCAT(YEAR(I.ITEM_DT_AQUISICAO), LPAD(MONTH(I.ITEM_DT_AQUISICAO), 2, '0')) <= CONCAT(YEAR(CURRENT_DATE), LPAD(MONTH(CURRENT_DATE), 2, '0'))
  GROUP BY
    CONCAT(YEAR(I.ITEM_DT_AQUISICAO), LPAD(MONTH(I.ITEM_DT_AQUISICAO), 2, '0'));
  `);

  return percentageLastMonth[1];
};

export const getItemsTotalValueInYear = async () => {
  const [totalValueYear] = await db.query(`
  SELECT 
    CONCAT('R$ ', FORMAT(SUM(ITEM_DC_VALOR), 2, 'de_De')) AS totalValue
  FROM 
    EST_ITENS
  WHERE 
  YEAR(ITEM_DT_AQUISICAO) = YEAR(CURDATE())
  AND ITEM_CH_ATIVO = 'S'
  GROUP BY 
    YEAR(ITEM_DT_AQUISICAO)
  `);

  return totalValueYear[0];
};

export const getItemAvarageAge = async () => {
  const [avarageAge] = await db.query(`
  SELECT 
    AVG(MONTH(CURDATE()) - MONTH(ITEM_DT_AQUISICAO) + 12 * (YEAR(CURDATE()) - YEAR(ITEM_DT_AQUISICAO))) AS avarageAge
  FROM 
    EST_ITENS 
  WHERE ITEM_CH_ATIVO = 'S'
  `);

  return avarageAge[0];
};

export const getItemByCostCenter = async () => {
  const [itemByCostCenter] = await db.query(`
  SELECT
    I.ITEM_IN_ID AS _id,
    I.ITEM_ST_NOME AS name,
    SUM(I.ITEM_DC_VALOR) AS totalValue,
    C.CUSTO_ST_NOME AS costCenter
  FROM
    EST_ITENS I
  INNER JOIN 
    GLO_CENTRO_CUSTO C ON I.CUSTO_IN_ID = C.CUSTO_IN_ID
  WHERE 
    ITEM_CH_ATIVO = 'S'
  GROUP BY 
    I.ITEM_ST_NOME,
    C.CUSTO_ST_NOME
  `);

  return itemByCostCenter;
};

export const getItemByItemGroup = async () => {
  const [itemByItemGroup] = await db.query(`
  SELECT
    I.ITEM_IN_ID AS _id,
    I.ITEM_ST_NOME AS name,
    SUM(I.ITEM_DC_VALOR) AS totalValue,
    G.GRUPO_ST_NOME AS itemGroup
  FROM
    EST_ITENS I
  INNER JOIN 
    EST_GRUPOS G ON I.GRUPO_IN_ID = G.GRUPO_IN_ID
  WHERE 
    ITEM_CH_ATIVO = 'S'
  GROUP BY 
    I.ITEM_ST_NOME,
    G.GRUPO_ST_NOME 
  `);

  return itemByItemGroup;
};
