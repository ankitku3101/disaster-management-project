'use client';
import { useState } from 'react';
import { UserReport } from '@/types/report';

interface ReportFormProps {
  onSubmit: (report: UserReport) => void;
}

export function ReportForm({ onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    disasterType: 'select',
    location: '',
    pincode: '',
    description: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      alert('Please select an image');
      return;
    }

    const timestamp = new Date().toISOString();

    const form = new FormData();
    form.append('name', formData.name);
    form.append('disasterType', formData.disasterType);
    form.append('location', formData.location);
    form.append('pincode', String(Number(formData.pincode)));
    form.append('description', formData.description);
    form.append('timestamp', timestamp);
    form.append('image', imageFile);

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const newReport: UserReport = {
          name: formData.name,
          disasterType: formData.disasterType,
          location: formData.location,
          pincode: Number(formData.pincode),
          description: formData.description,
          timestamp,
          imageUrl: formData.imageUrl,
        };

        onSubmit(newReport); // 🔥 Call the parent prop function

        alert('Report submitted successfully!');
        setFormData({
          name: '',
          disasterType: 'select',
          location: '',
          pincode: '',
          description: '',
          imageUrl: '',
        });
        setImageFile(null);
      } else {
        const errorData = await res.json();
        console.error('Error:', errorData);
        alert('Failed to submit report');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while submitting the report.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="w-full p-2 rounded border"
        required
      />

      <select
        name="disasterType"
        value={formData.disasterType}
        onChange={handleChange}
        className="w-full p-2 rounded border"
        required
      >
        <option value="select" disabled>Select Disaster Type</option>
        <option value="cyclone">Cyclone</option>
        <option value="flood">Flood</option>
        <option value="earthquake">Earthquake</option>
        <option value="forest fire">Forest Fire</option>
        <option value="landslide">Landslide</option>
        <option value="heatwaves">Heatwaves</option>
      </select>

      <input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full p-2 rounded border"
        required
      />
      
      <input
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        className="w-full p-2 rounded border"
        required
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Incident Description"
        className="w-full p-2 rounded border"
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full"
      />
      {formData.imageUrl && (
        <img src={formData.imageUrl} alt="Uploaded preview" className="max-h-40 rounded" />
      )}

      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Submit Report
      </button>
    </form>
  );
}
