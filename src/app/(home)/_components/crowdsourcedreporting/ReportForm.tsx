'use client';
import { useState } from 'react';

export function ReportForm() {
  const [formData, setFormData] = useState({
    name: '',
    disasterType: 'select',
    location: '',
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

    const form = new FormData();
    form.append('name', formData.name);
    form.append('disasterType', formData.disasterType);
    form.append('location', formData.location);
    form.append('description', formData.description);
    form.append('timestamp', new Date().toISOString());
    form.append('image', imageFile);

    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Success:', data);
        alert('Report submitted successfully!');
        setFormData({
          name: '',
          disasterType: 'select',
          location: '',
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
