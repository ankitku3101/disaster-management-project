import mongoose, { Schema, Document, models } from 'mongoose';

export interface IReport extends Document {
  name: string;
  disasterType: string;
  location: string;
  description: string;
  pincode: number;
  imageUrl: string;
  timestamp: string;
}

const ReportSchema = new Schema<IReport>({
  name: { type: String, required: true },
  disasterType: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  pincode: { type: Number, required: true, default: 0 }, 
  imageUrl: { type: String, required: true },
  timestamp: { type: String, required: true },
}, {
  strict: true, 
  versionKey: false,
});

export default models.Report || mongoose.model<IReport>('Report', ReportSchema);
