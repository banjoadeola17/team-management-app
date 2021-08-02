const mongoose = require("mongoose");
const MemberType = require("./member.type");
const {Tag} = require("./tag.model.js");

const ObjectId = mongoose.Schema.Types.ObjectId;

const schema = {
  firstName: {
    type: String,
    required: true,
    index: true
  },

  lastName: {
    type: String,
    required: true,
    index: true
  },

  role: {
    type: String
  },

  contractDuration: {
    type: Number
  },

  tags: [
    {
      type: ObjectId,
      ref: "Tag",
    },
  ],

  memberType: {
    type: String,
    enum: [MemberType.EMPLOYEE, MemberType.CONTRACTOR],
    required: true
  },
};

const memberSchema = new mongoose.Schema(schema, { timestamps: true });

memberSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

exports.Member = mongoose.model("Member", memberSchema);
