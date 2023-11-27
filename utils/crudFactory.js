const getAllFactory = (elementModel) =>
  async function (req, res) {
    try {
      const data = await elementModel.find();
      if (data.length === 0) {
        throw new Error("No data found");
      } else {
        res.status(200).json({
          message: data,
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

const createFactory = (elementModel) =>
  async function (req, res) {
    try {
      const elementDetails = req.body;
      const data = await elementModel.create(elementDetails);
      res.status(201).json({
        message: "Data created successfully",
        data: data,
      });
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

const getElementByIdFactory = (elementModel) =>
  async function (req, res) {
    try {
      const { id } = req.params;
      const data = await elementModel.findById(id);
      if (data == undefined) {
        throw new Error("Data not found");
      } else {
        return res.status(200).json({
          message: data,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      });
    }
  };

const checkInput = function (req, res, next) {
  const input = req.body;
  console.log("input", input)
  const isEmpty = Object.keys(input).length === 0;
  if (isEmpty) {
    return res.status(400).json({
      message: "Input fields cannot be empty",
    });
  } else {
    next();
  }
};

const deleteElementByIdFactory = (elementModel) =>
  async function (req, res) {
    const id = req.params.id;
    try {
      const data = await elementModel.findByIdAndDelete(id);
      if (data) {
        res.status(200).json({
          message: "Data deleted successfully",
          data: data,
        });
      } else {
        res.status(404).json({
          message: "Data not found",
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };
module.exports = {
  getAllFactory,
  createFactory,
  getElementByIdFactory,
  checkInput,
  deleteElementByIdFactory,
};
