// services/getSafetyTips.ts
export async function getSafetyTips() {
    try {
      const response = await fetch('https://mole-model-drake.ngrok-free.app/disaster-alert');
      if (!response.ok) throw new Error('Failed to fetch safety tips');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching safety tips:', error);
      return [];
    }
  }
  