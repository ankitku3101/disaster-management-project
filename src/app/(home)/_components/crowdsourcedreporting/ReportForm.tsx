'use client';
import { useState } from 'react';
import { UserReport } from '@/types/report';
import { getSafetyTipsForReport } from '@/services/getSafetyTips';
import { Loader2 } from 'lucide-react';

interface ReportFormProps {
  onSubmit: (report: UserReport) => void;
  onSafetyTips?: (tips: any) => void;
}

export function ReportForm({ onSubmit, onSafetyTips }: ReportFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    disasterType: 'select',
    location: '',
    pincode: '',
    description: '',
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [safetyTips, setSafetyTips] = useState<any>(null);
  const [showSafetyTips, setShowSafetyTips] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

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

        onSubmit(newReport);

        // Fetch safety tips after successful report submission
        const safetyTipsResponse = await getSafetyTipsForReport({
          location: formData.location,
          disaster_type: formData.disasterType,
          description: formData.description,
        });

        if (safetyTipsResponse) {
          setSafetyTips(safetyTipsResponse);
          setShowSafetyTips(true);
          onSafetyTips?.(safetyTipsResponse);
        }

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
    } finally {
      setIsSubmitting(false);
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
        disabled={isSubmitting}
      />

      <select
        name="disasterType"
        value={formData.disasterType}
        onChange={handleChange}
        className="w-full p-2 rounded border"
        required
        disabled={isSubmitting}
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
        disabled={isSubmitting}
      />
      
      <input
        name="pincode"
        value={formData.pincode}
        onChange={handleChange}
        placeholder="Pincode"
        className="w-full p-2 rounded border"
        required
        disabled={isSubmitting}
      />

      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Incident Description"
        className="w-full p-2 rounded border"
        required
        disabled={isSubmitting}
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="w-full"
        disabled={isSubmitting}
      />
      {formData.imageUrl && (
        <img src={formData.imageUrl} alt="Uploaded preview" className="max-h-40 rounded" />
      )}

      <button
        type="submit"
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center justify-center gap-2 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Submitting Report...</span>
          </>
        ) : (
          'Submit Report'
        )}
      </button>

      {showSafetyTips && safetyTips && (
        <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-blue-800">Safety Information</h3>
          </div>

          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="font-semibold text-gray-800">Severity Level: 
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-bold ${
                  safetyTips.severity_classification.severity === 'HIGH' 
                    ? 'bg-red-100 text-red-800' 
                    : safetyTips.severity_classification.severity === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {safetyTips.severity_classification.severity}
                </span>
              </h4>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="font-semibold text-gray-800">Immediate Actions</h4>
              </div>
              <ul className="space-y-2">
                {safetyTips.safety_tips.immediate_actions.map((action: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h4 className="font-semibold text-gray-800">Preparation Steps</h4>
              </div>
              <ul className="space-y-2">
                {safetyTips.safety_tips.preparation_steps.map((step: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-blue-500">•</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
              </svg>
              <h4 className="font-semibold text-gray-800">Evacuation Guidance</h4>
            </div>
            <p className="text-sm text-gray-700 pl-7">{safetyTips.safety_tips.evacuation_guidance}</p>
          </div>
        </div>
      )}
    </form>
  );
}
