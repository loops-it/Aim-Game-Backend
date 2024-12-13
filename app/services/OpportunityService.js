const Opportunity = require("../models/opportunity");
const FunnelStatusModel = require("../models/funnelStatus");
const workspaceUserService = require("../services/WorkspaceUserService");
const TaskModel = require("../models/task");
exports.getAllOpportunities = async (filter) => {
  console.log("filter", filter);
  const opportunities = await Opportunity.find(filter)
  .populate({
    path: "funnelStatusId",
    model: FunnelStatusModel,
    select: "_id status stage rate level", // Include 'level' in the select statement
  })
  .exec();

  return opportunities;
};

exports.getOpportunitiesByWorkspaceAndClient = async (
  workspaceId,
  clientId
) => {
  try {
    const opportunities = await Opportunity.find({
      workspaceId,
      clientId,
    })
      .populate({
        path: "funnelStatusId",
        model: FunnelStatusModel,
        select: "_id status stage rate level order",
      })
      .populate({
        path: "leadId",
        model: "User",
        select: "_id name email",
      })
      .populate({
        path: "team",
        model: "User",
        select: "_id name email",
      })
      .populate({
        path: "partners",
        model: "Partner",
        select: "_id name",
      });

    // const opportunityIds = opportunities.map((opportunity) => opportunity._id);

    // // Fetch tasks associated with the extracted opportunityIds
    // const tasks = await TaskModel.find({
    //   opportunityId: { $in: opportunityIds },
    // }).select("_id description dueDate status");

    // // Add tasks to the corresponding opportunities
    // opportunities.forEach((opportunity) => {
    //   opportunity.tasks = tasks.filter((task) =>
    //     task.opportunityId.equals(opportunity._id)
    //   );
    // });

    return opportunities;
  } catch (error) {
    throw error;
  }
};

exports.getOpportunitiesByWorkspaceId = async (workspaceId) => {
  const opportunities = await Opportunity.find({ workspaceId: workspaceId });
  return opportunities;
};

exports.getOpportunitiesByClientId = async (clientId) => {
  const opportunities = await Opportunity.find({ clientId });
  return opportunities;
};

exports.getOpportunityById = async (opportunityId) => {
  const opportunity = await Opportunity.findById(opportunityId)
    .populate({
      path: "funnelStatusId",
      model: FunnelStatusModel,
      select: "_id status stage rate level order",
    })
    .populate({
      path: "leadId",
      model: "User",
      select: "_id name email",
    })
    .populate({
      path: "team",
      model: "User",
      select: "_id name email",
    })
    .populate({
      path: "opportunityMappingRoles.clientPerson",
      model: "ClientOrganization", // Assuming you have a model for ClientOrganization
      select: "_id name email phone department designation", // Adjust the fields you want to select
    })

    // .populate({
    //   path: "partners",
    //   model: "Partner",
    //   select: "_id name company contacts",
    // })
    .exec();

  const updatedLeadData = await workspaceUserService.getWorkspaceUserData(
    opportunity.leadId
  );

  const updatedTeam = await workspaceUserService.getWorkspaceTeamData(
    opportunity.team
  );

  return {
    ...opportunity.toObject(),
    team: updatedTeam,
    leadId: updatedLeadData,
  };
};

exports.createOpportunity = async (opportunityData) => {
  if (opportunityData?.leadId) {
    console.log("leadId", opportunityData?.leadId);
    const team = opportunityData?.team ?? [];
    if (team.includes(opportunityData?.leadId)) {
      console.log("team", team);
    } else {
      team.push(opportunityData?.leadId);
      opportunityData.team = team;
    }
  }
  const newOpportunity = new Opportunity(opportunityData);
  const createdOpportunity = await newOpportunity.save();
  console.log("createdOpportunity", createdOpportunity);
  return createdOpportunity;
};

exports.updateOpportunity = async (opportunityId, updatedData) => {
  console.log("updatedData", updatedData);
  if (updatedData?.leadId) {
    console.log("leadId", updatedData?.leadId);
    const teamMems = await Opportunity.findById(opportunityId);
    console.log("teamMems", teamMems);
    const team = teamMems.team;
    if (team.includes(updatedData?.leadId)) {
      console.log("team", team);
    } else {
      team.push(updatedData?.leadId);
      updatedData.team = team;
    }
  }

  const updatedOpportunity = await Opportunity.findByIdAndUpdate(
    opportunityId,
    updatedData,
    { new: true }
  );
  return updatedOpportunity;
};

exports.deleteOpportunity = async (opportunityId) => {
  const deletedOpportunity = await Opportunity.findByIdAndDelete(opportunityId);
  return deletedOpportunity;
};

exports.getOpportunityMappingRole = async (opportunityId, clientPersonId) => {
  try {
    const opportunityMappingRole = await Opportunity.findOne(
      {
        _id: opportunityId,
        "opportunityMappingRoles._id": clientPersonId,
      },
      {
        "opportunityMappingRoles.$": 1, // Projection to select only the matched opportunityMappingRole
      }
    ).populate({
      path: "opportunityMappingRoles.clientPerson",
      model: "ClientOrganization", // Assuming you have a model for ClientOrganization
      select: "_id name email phone designation department", // Adjust the fields you want to select
    });

    return opportunityMappingRole;
  } catch (error) {
    throw error;
  }
};

exports.createOpportunityMappingRole = async (id, data) => {
  try {
    const opportunityMappingRole = await Opportunity.findByIdAndUpdate(
      id,
      {
        $push: {
          opportunityMappingRoles: data,
        }, 
      },
      { new: true }
    );
    return opportunityMappingRole;
  } catch (error) {
    throw error;
  }
};

exports.updateOpportunityMappingRole = async (
  opportunityId,
  clientPersonId,
  data
) => {
  try {
    const opportunityMappingRole = await Opportunity.findOneAndUpdate(
      {
        _id: opportunityId,
        "opportunityMappingRoles._id": clientPersonId,
      },
      {
        $set: {
          "opportunityMappingRoles.$": data,
        },
      },
      { new: true }
    );
    return opportunityMappingRole;
  } catch (error) {
    throw error;
  }
};

exports.deleteOpportunityMappingRole = async (
  opportunityId,
  clientPersonId
) => {
  try {
    const opportunityMappingRole = await Opportunity.findByIdAndUpdate(
      opportunityId,
      {
        $pull: {
          opportunityMappingRoles: { _id: clientPersonId },
        },
      },
      { new: true }
    );
    return opportunityMappingRole;
  } catch (error) {
    throw error;
  }
};

exports.getOpportunityMembers = async (opportunityId) => {
  try {
    const opportunity = await Opportunity.findById(opportunityId).populate({
      path: "team",
      model: "User",
      select: "_id name email",
    });
    return opportunity.team;
  } catch (error) {
    throw error;
  }
};


exports.getOpportunityMappingRoles = async (opportunityId) => {
  try {
    const opportunity = await Opportunity.findById(opportunityId).populate({
      path: "opportunityMappingRoles",
    });
    return opportunity.opportunityMappingRoles;
  } catch (error) {
    throw error;
  }
};

exports.searchOpportunities = async (searchValue) => {
  console.log("searchValue", searchValue);
  const opportunities = await Opportunity.find(  {
    referenceNumber: searchValue,
  })
  .populate({
    path: "funnelStatusId",
    model: FunnelStatusModel,
    select: "_id status stage rate level", // Include 'level' in the select statement
  })
  .exec();

  return opportunities;
};