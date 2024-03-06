const { Foo } = require("../models");

module.exports = {
  create: async (req, res) => {
    try {
      const { firstName, phoneNumber } = req.body;

      if (!firstName) {
        return res.status(400).json({ message: "No firstName provided" });
      }
      if (!phoneNumber) {
        return res.status(400).json({ message: "No phoneNumber provided" });
      }

      return res
        .status(200)
        .json({ id: createdUser.id, message: "Foo created successfully" });
    } catch (err) {
      console.error("Error creating user: ", err);
      return res.status(200).json({ message: "Oops! couldn't create a Foo" });
    }
  },

  remove: async (req, res) => {
    try {
      const { user_id } = req.params;

      await Foo.destroy({ where: { id: user_id } });

      return res.status(200).json({ message: "Foo removed successfully!" });
    } catch (err) {
      console.error("Error while deleting Foo from db: ", err);
      return res.status(200).json({ message: "Couldn't delete Foo" });
    }
  },

  update: async (req, res) => {
    try {
      const { user_id } = req.params;
      const { firstName } = req.body;

      await Foo.update(
        {
          firstName: firstName,
        },
        {
          where: { id: user_id },
        }
      );

      return res.status(200).json({ message: "Foo updated successfully" });
    } catch (err) {
      console.error("Error while updating Foo: ", err);
      return res.status(200).json({ message: "Couldn't update foo" });
    }
  },
};
