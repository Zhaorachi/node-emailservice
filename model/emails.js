const mongoose = require('mongoose');
const emailSchema = new mongoose.Schema(
    {
        sender: String,
        receiver: String,
        title: String,
        subject: String,
        body: String,
        email_id: String,
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    }
);

emailSchema.statics.findOneOrCreate = function findOneOrCreate(condition, callback) {
    const self = this;
    return self.findOne(condition, (err, result) => {
        if(!result) {
            self.create(condition);
        }
        return callback(result);
    });
};

const emails = mongoose.model('emails', emailSchema);

module.exports = emails;
