// components/crowdsourcedreporting/ReportForm.tsx
'use client';

import { useState } from 'react';
import { UserReport } from '@/types/report';

type Props = {
  onSubmit: (report: UserReport) => void;
};

export const ReportForm = ({ onSubmit }: Props) => {
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !media) return;

    const newReport: UserReport = {
      id: Date.now().toString(),
      description,
      timestamp: new Date().toISOString(),
      mediaUrl: media ? URL.createObjectURL(media) : undefined,
    };

    onSubmit(newReport);
    setDescription('');
    setMedia(null);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 space-y-2">
      <textarea
        className="w-full border rounded p-2"
        placeholder="Describe the incident..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={(e) => setMedia(e.target.files?.[0] || null)}
        className="block"
      />
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit Report
      </button>
    </form>
  );
};
