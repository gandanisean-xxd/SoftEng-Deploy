import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  location: { type: String, required: true },
  hazards: { type: [String], required: true },
  result: { type: String, required: true }, // Store result details
});

const SubmissionModel = mongoose.model('Submission', SubmissionSchema);

export default SubmissionModel;
