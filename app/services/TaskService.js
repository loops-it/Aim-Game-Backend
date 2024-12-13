const e = require("express");
const { notFoundException } = require("../exception");
const TaskModel = require("../models/task");
const WorkspaceModel = require("../models/workspace");
const IndustryTypeModel = require("../models/industryType");
const FunnelStatusModel = require("../models/funnelStatus");
const OpportunityModel = require("../models/opportunity");
const UserModel = require("../models/user");
const s3service = require("./s3Service");

exports.getAllTasks = async () => { 
  const tasks = await TaskModel.find({});
  return tasks;
};

exports.getTaskById = async (id) => {
  const task = await TaskModel.findById(id);
  return task;
};

exports.getAllTasksByUserId = async (userId) => {
  const tasks = await TaskModel.find({ userId: userId });
  return tasks;
};

exports.getAllTasksByOpportunityId = async (opportunityId) => {
  const tasks = await TaskModel.find({ opportunityId: opportunityId });
  return tasks;
};

exports.createTask = async (task) => {
  console.log("task", task);
  let prevFunnelStatus = "";
  if (task?.funnelStatus) {
    const funnelStatusIdExists = await FunnelStatusModel.findOne({
      _id: task.funnelStatus,
    });
    console.log("funnelStatusIdExists", funnelStatusIdExists);
    if (!funnelStatusIdExists) {
      console.log("FunnelStatus not found");
      throw new notFoundException("FunnelStatus not found");
    }
    if (funnelStatusIdExists?.order !== 1) {
      const tasks = await TaskModel.find({
        opportunityId: task?.opportunityId,
      }).populate("funnelStatus");
      // console.log("tasks", tasks);
      // const taskExists = tasks.map((task) => {
      //   if (task.funnelStatus.order === funnelStatusIdExists?.order - 1) {
      //     return task;
      //   }
      // });
      const taskExists = tasks.filter(
        (task) => task.funnelStatus.order === funnelStatusIdExists?.order - 1
      );
      prevFunnelStatus = await FunnelStatusModel.findOne({
        order: funnelStatusIdExists?.order - 1,
      });
      console.log("taskExists", taskExists);
      if (!taskExists || taskExists?.length === 0) {
        console.log("Previous task not found");
        throw new notFoundException("Previous task not found");
      }
      const allNotCompleted = taskExists.filter(
        (task) => task.status !== "Completed"
      );
      console.log("allNotCompleted", allNotCompleted);
      if (allNotCompleted?.length > 0) {
        console.log("Previous task not completed");
        throw new notFoundException("Previous task not completed");
      }
    }
  }
  if (task?.opportunityId) {
    const opportunityIdExists = await OpportunityModel.findOne({
      _id: task.opportunityId,
    });

    const updatedOpportunity = await OpportunityModel.findByIdAndUpdate(
      task.opportunityId,
      { funnelStatusId: prevFunnelStatus?._id },
      { new: true }
    );
    if (!opportunityIdExists) {
      console.log("Opportunity not found");
      throw new notFoundException("Opportunity not found");
    }
  }
  if (task?.userId) {
    const userIdExists = await UserModel.findOne({
      _id: task.userId,
    });
    if (!userIdExists) {
      console.log("User not found");
      throw new notFoundException("User not found");
    }
  }

  const createdTask = await new TaskModel(task).save();
  return createdTask;
};

exports.updateTask = async (id, task) => {
  if (task.funnelStatusId) {
    const funnelStatusIdExists = await FunnelStatusModel.findOne({
      _id: task.funnelStatusId,
    });
    if (!funnelStatusIdExists) {
      console.log("Funnel Status not found");
      throw new notFoundException("Funnel Status not found");
    }
  }
  if (task?.opportunityId) {
    const opportunityIdExists = await OpportunityModel.findOne({
      _id: task.opportunityId,
    });
    if (!opportunityIdExists) {
      console.log("Opportunity not found");
      throw new notFoundException("Opportunity not found");
    }
  }
  if (task?.userId) {
    const userIdExists = await UserModel.findOne({
      _id: task.userId,
    });
    if (!userIdExists) {
      console.log("User not found");
      throw new notFoundException("User not found");
    }
  }
  const updatedTask = await TaskModel.findByIdAndUpdate(id, task, {
    new: true,
  });
  return updatedTask;
};

exports.fetchMyTasks = async (userId) => {
  const tasks = await TaskModel.find({ assignee: userId });
  return tasks;
};
