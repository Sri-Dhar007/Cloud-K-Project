const { Branch } = require('../models');

exports.createBranch = async (req, res) => {
  try {
    const { name, address, phone_number } = req.body;
    const branch = await Branch.create({ name, address, phone_number });
    res.status(201).json({ message: 'Branch created successfully', branch });
  } catch (error) {
    console.error('Error creating branch:', error);
    res.status(500).json({ error: 'Failed to create branch. Please try again later.' });
  }
};

exports.getBranches = async (req, res) => {
  try {
    const branches = await Branch.findAll();
    res.json(branches);
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({ error: 'Failed to fetch branches. Please try again later.' });
  }
};

exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    res.json(branch);
  } catch (error) {
    console.error('Error fetching branch by ID:', error);
    res.status(500).json({ error: 'Failed to fetch branch. Please try again later.' });
  }
};

exports.updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone_number } = req.body;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    await branch.update({ name, address, phone_number });
    res.json({ message: 'Branch updated successfully', branch });
  } catch (error) {
    console.error('Error updating branch:', error);
    res.status(500).json({ error: 'Failed to update branch. Please try again later.' });
  }
};

exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({ error: 'Branch not found' });
    }
    await branch.destroy();
    res.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    res.status(500).json({ error: 'Failed to delete branch. Please try again later.' });
  }
};
