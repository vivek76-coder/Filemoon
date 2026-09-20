const FileModel = require("../model/file.model");
const mongoose = require("mongoose");

const fetchDashboard = async (req, res) => {
  try {
    const reports = await FileModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  fetchDashboard,
};

