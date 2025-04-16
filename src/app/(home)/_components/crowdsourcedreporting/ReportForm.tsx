'use client';
import { useState } from 'react';
import { UserReport } from '@/types/report';

type Props = {
  onSubmit: (report: UserReport) => void;
};

export function ReportForm({ onSubmit }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    disasterType: 'flood',
    location: '',
    pinCode: '',
    description: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: UserReport = {
      ...formData,
      timestamp: new Date().toISOString(),
    };
    onSubmit(newReport);
    setFormData({ name: '', disasterType: 'flood', location: '', pinCode: '', description: '', imageUrl: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className="w-full p-2 rounded border" required />
      
      <select name="disasterType" value={formData.disasterType} onChange={handleChange} className="w-full p-2 rounded border" required>
        <option value="cyclone">Cyclone</option>
        <option value="flood">Flood</option>
        <option value="earthquake">Earthquake</option>
        <option value="forest fire">Forest Fire</option>
        <option value="landslide">Landslide</option>
        <option value="heatwaves">Heatwaves</option>
      </select>

      <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full p-2 rounded border" required />
      
      <input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="Pin Code" className="w-full p-2 rounded border" required />
      
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Incident Description" className="w-full p-2 rounded border" required />
      
      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
      {formData.imageUrl && <img src={formData.imageUrl} alt="Uploaded preview" className="max-h-40 rounded" />}
      
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        Submit Report
      </button>
    </form>
  );
}
