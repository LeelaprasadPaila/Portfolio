import Bio from '../models/Bio.js';

export const getBio = async (req, res) => {
  try {
    let bio = await Bio.findOne().lean();
    if (!bio) {
      bio = new Bio();
      await bio.save();
    }
    res.json(bio);
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const updateBio = async (req, res) => {
  try {
    let bio = await Bio.findOne();
    if (!bio) {
      bio = new Bio(req.body);
    } else {
      Object.assign(bio, req.body);
    }
    await bio.save();
    res.json({ message: 'Bio updated successfully', bio });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export default { getBio, updateBio };
