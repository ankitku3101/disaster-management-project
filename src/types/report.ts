export interface UserReport {
  _id: string;
  name: string;
  location: string;
  pincode: number;
  disasterType: string;
  description: string;
  imageUrl: string;
  timestamp: string;
  severity?: string;
}
