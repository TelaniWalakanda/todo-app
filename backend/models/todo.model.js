import mongoose from "mongoose";

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [1, 'Title cannot be empty'],
        maxlength: [TITLE_MAX_LENGTH, `Title cannot exceed ${TITLE_MAX_LENGTH} characters`]
    },
    description: {
        type: String,
        default: '',
        trim: true,
        maxlength: [DESCRIPTION_MAX_LENGTH, `Description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters`]
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

export default mongoose.model("Todo", todoSchema);