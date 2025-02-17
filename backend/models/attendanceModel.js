const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    students: [
        {
            studentId : {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            status: {
                type: String,
                enum: ['present', 'absent'],
                required: true
            }
        }
    ]
})

attendanceSchema.statics.findData = async function (date, subject) {
    if ( !date || !subject ) {
        throw Error('All fields must be filled');
    }
    console.log(date, subject);
    const data = await this.findOne({ date, subject });

    if(!data){
        throw Error('Incorrect date and subject');
    }

    return data;
};
module.exports = mongoose.model('Attendance', attendanceSchema);