const { MenuItem, Category, Branch } = require('../models');

exports.createMenuItem = async (req, res) => {
  try {
    const { name, description, price, CategoryId, BranchId } = req.body;
    const menuItem = await MenuItem.create({ name, description, price, CategoryId, BranchId });
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({ include: [Category, Branch] });
    res.json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id, { include: [Category, Branch] });
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const { name, description, price, categoryId, branchId } = req.body;
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    menuItem.name = name;
    menuItem.description = description;
    menuItem.price = price;
    menuItem.CategoryId = categoryId;
    menuItem.BranchId = branchId;
    await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    await menuItem.destroy();
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMenuByOther = async (req, res) => {
  try {
    const { categoryId, branchId } = req.body;

    const whereClause = {};
    if (categoryId) whereClause.CategoryId = categoryId;
    if (branchId) whereClause.BranchId = branchId;

    const menuItems = await MenuItem.findAll({ 
      where: whereClause,
      include: [Category, Branch] 
    });
    
    res.json(menuItems);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};