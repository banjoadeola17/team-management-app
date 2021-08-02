const mongoose = require("mongoose");

const schema = {
    tagName: {
        type: String,
        required: true,
    },

    tagDetails: {
        type: String,
        required: true,
    },
};

const tagSchema = new mongoose.Schema(schema, { timestamps: true });

tagSchema.set("toJSON", {
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
});

exports.Tag = mongoose.model("Tag", tagSchema);
