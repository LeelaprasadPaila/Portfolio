import Skill from '../models/Skill.js';

export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const createSkill = async (req, res) => {
  try {
    const { category, title, icon, skills } = req.body;

    if (!category) {
      return res.status(400).json({ message: 'Category is required', error: true });
    }

    const skillData = {
      category,
      title,
      icon,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
    };

    const skill = new Skill(skillData);
    await skill.save();
    res.status(201).json({ message: 'Skill created successfully', skill });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found', error: true });
    }

    const { category, title, icon, skills } = req.body;

    skill.category = category || skill.category;
    skill.title = title || skill.title;
    skill.icon = icon || skill.icon;
    if (skills) {
      skill.skills = Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []);
    }

    await skill.save();
    res.json({ message: 'Skill updated successfully', skill });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found', error: true });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getSkills, createSkill, updateSkill, deleteSkill };
