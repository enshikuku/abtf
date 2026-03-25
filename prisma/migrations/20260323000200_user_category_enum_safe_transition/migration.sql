-- Safe transition from legacy VARCHAR category values to canonical enum values.
-- This migration is idempotent and will skip ALTERs when columns are already enum.

UPDATE `User`
SET `category` = CASE
  WHEN `category` IS NULL OR TRIM(`category`) = '' THEN NULL
  WHEN LOWER(TRIM(`category`)) IN ('agricultural-machinery', 'agricultural machinery', 'machinery') THEN 'agricultural-machinery'
  WHEN LOWER(TRIM(`category`)) IN ('crops-and-seeds', 'crops and seeds', 'crops') THEN 'crops-and-seeds'
  WHEN LOWER(TRIM(`category`)) IN ('livestock-and-animal-production', 'livestock and animal production', 'livestock-and-veterinary', 'livestock and veterinary', 'animals') THEN 'livestock-and-animal-production'
  WHEN LOWER(TRIM(`category`)) IN ('food-and-agro-processing', 'food and agro-processing', 'food') THEN 'food-and-agro-processing'
  WHEN LOWER(TRIM(`category`)) IN ('agribusiness-finance-and-insurance', 'agribusiness, finance and insurance', 'agribusiness finance and insurance') THEN 'agribusiness-finance-and-insurance'
  WHEN LOWER(TRIM(`category`)) IN ('regulatory-research-and-learning-institutions', 'regulatory, research and learning institutions', 'regulatory research and learning institutions') THEN 'regulatory-research-and-learning-institutions'
  WHEN LOWER(TRIM(`category`)) IN ('cooperatives-msmes-ngos-and-cbos', 'cooperatives, msmes, ngos and cbos', 'cooperatives msmes ngos and cbos') THEN 'cooperatives-msmes-ngos-and-cbos'
  WHEN LOWER(TRIM(`category`)) IN ('environment-and-climate-smart-solutions', 'environment and climate-smart solutions', 'environment and climate smart solutions') THEN 'environment-and-climate-smart-solutions'
  ELSE NULL
END;

UPDATE `User`
SET `exhibitorCategory` = CASE
  WHEN `exhibitorCategory` IS NULL OR TRIM(`exhibitorCategory`) = '' THEN NULL
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('agricultural-machinery', 'agricultural machinery', 'machinery') THEN 'agricultural-machinery'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('crops-and-seeds', 'crops and seeds', 'crops') THEN 'crops-and-seeds'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('livestock-and-animal-production', 'livestock and animal production', 'livestock-and-veterinary', 'livestock and veterinary', 'animals') THEN 'livestock-and-animal-production'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('food-and-agro-processing', 'food and agro-processing', 'food') THEN 'food-and-agro-processing'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('agribusiness-finance-and-insurance', 'agribusiness, finance and insurance', 'agribusiness finance and insurance') THEN 'agribusiness-finance-and-insurance'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('regulatory-research-and-learning-institutions', 'regulatory, research and learning institutions', 'regulatory research and learning institutions') THEN 'regulatory-research-and-learning-institutions'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('cooperatives-msmes-ngos-and-cbos', 'cooperatives, msmes, ngos and cbos', 'cooperatives msmes ngos and cbos') THEN 'cooperatives-msmes-ngos-and-cbos'
  WHEN LOWER(TRIM(`exhibitorCategory`)) IN ('environment-and-climate-smart-solutions', 'environment and climate-smart solutions', 'environment and climate smart solutions') THEN 'environment-and-climate-smart-solutions'
  ELSE NULL
END;

SET @needs_category_enum := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'User'
    AND COLUMN_NAME = 'category'
    AND DATA_TYPE <> 'enum'
);

SET @category_sql := IF(
  @needs_category_enum > 0,
  'ALTER TABLE `User` MODIFY `category` ENUM(''agricultural-machinery'', ''crops-and-seeds'', ''livestock-and-animal-production'', ''food-and-agro-processing'', ''agribusiness-finance-and-insurance'', ''regulatory-research-and-learning-institutions'', ''cooperatives-msmes-ngos-and-cbos'', ''environment-and-climate-smart-solutions'') NULL',
  'SELECT 1'
);
PREPARE category_stmt FROM @category_sql;
EXECUTE category_stmt;
DEALLOCATE PREPARE category_stmt;

SET @needs_exhibitor_category_enum := (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'User'
    AND COLUMN_NAME = 'exhibitorCategory'
    AND DATA_TYPE <> 'enum'
);

SET @exhibitor_category_sql := IF(
  @needs_exhibitor_category_enum > 0,
  'ALTER TABLE `User` MODIFY `exhibitorCategory` ENUM(''agricultural-machinery'', ''crops-and-seeds'', ''livestock-and-animal-production'', ''food-and-agro-processing'', ''agribusiness-finance-and-insurance'', ''regulatory-research-and-learning-institutions'', ''cooperatives-msmes-ngos-and-cbos'', ''environment-and-climate-smart-solutions'') NULL',
  'SELECT 1'
);
PREPARE exhibitor_category_stmt FROM @exhibitor_category_sql;
EXECUTE exhibitor_category_stmt;
DEALLOCATE PREPARE exhibitor_category_stmt;
