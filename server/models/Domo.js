const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const _ = require('underscore');

let DomoModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        set: setName
    },
    age:{
        type: Number,
        min: 0,
        required: true
    },
    color:{
        type: String,
        required: true,
        trim: true
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account'
    },
    createdData:{
        type: Date,
        default: Date.now
    }
});

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    color: doc.color
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
    const search = {
        owner: convertId(ownerId)
    }

    return DomoModel.find(search).select('name age color').exec(callback);
}

DomoSchema.statics.removeById = (docId, callback) => {
    const search = {
        _id: docId
    };

    return DomoModel.find(search).remove().exec(callback);
}

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;