export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    views: {
      value: 3456,
      growthRate: 0.43,
    },
    profit: {
      value: 4220,
      growthRate: 4.35,
    },
    products: {
      value: 3456,
      growthRate: 2.59,
    },
    users: {
      value: 3456,
      growthRate: -0.95,
    },
  };
}

// fetch.ts

export async function getDisasterAlerts() {
  // This is mock data — you can replace it with a real API call later
  return [
    {
      title: "Earthquake in Nepal",
      description: "A 6.4 magnitude earthquake struck central Nepal today morning.",
      timestamp: new Date().toISOString(),
      url: "https://example.com/alerts/nepal-earthquake"
    },
    {
      title: "Flood Warning - Assam",
      description: "Heavy rainfall in upper Assam could cause flooding in low-lying areas.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      url: "https://example.com/alerts/assam-flood"
    },
    {
      title: "Cyclone Alert - Bay of Bengal",
      description: "Cyclone forming over Bay of Bengal expected to intensify within 48 hours.",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      url: "https://example.com/alerts/cyclone-bob"
    }
  ];
}
