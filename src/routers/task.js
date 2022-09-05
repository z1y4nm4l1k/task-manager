const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = express.Router();

// Task creation endpoint CREATE
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Querying READ
// router.get("/tasks", async (req, res) => {
//   try {
//     const tasks = await Task.find({});
//     res.send(tasks);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

// GET /tasks?completed=true||false // filtering
// pagination ------>> limit & skip /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt_asc||desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }
  try {
    // const tasks = await Task.find({ owner: req.user._id });
    // await req.user.populate("tasks");
    await req.user.populate({
      path: "tasks",
      match: match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: sort,
      },
    });
    // res.send(tasks);
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

// router.get("/tasks/:id", async (req, res) => {
//   const _id = req.params.id;
//   try {
//     const task = await Task.findById(_id);
//     if (!task) {
//       return res.status(404).send("Can't find that task");
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(500).send(e);
//   }
// });

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send("Can't find that task");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

// Updating UPDATE
// router.patch("/tasks/:id", async (req, res) => {
//   const updates = Object.keys(req.body);
//   const allowedUpdates = ["description", "completed"];
//   const isValidOperation = updates.every((update) => {
//     return allowedUpdates.includes(update);
//   });

//   if (!isValidOperation) {
//     return res.status(400).send({ error: "Invalid updates!" });
//   }
//   try {
//     const task = await Task.findById(req.params.id);
//     updates.forEach((update) => {
//       task[update] = req.body[update];
//     });
//     await task.save();
//     // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
//     //   runValidators: true,
//     //   new: true,
//     // });

//     if (!task) {
//       return res.status(404).send({ error: "task not found" });
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send({ error: "task not found" });
    }
    updates.forEach((update) => {
      task[update] = req.body[update];
    });
    await task.save();
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   runValidators: true,
    //   new: true,
    // });

    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Deleting DELETE
// router.delete("/tasks/:id", async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) {
//       return res.status(404).send("task not found!");
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send("task not found!");
    }
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
