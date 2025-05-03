// Mock revenue data
export const monthlyRevenue = [
    { name: 'Jan', revenue: 4200 },
    { name: 'Feb', revenue: 5000 },
    { name: 'Mar', revenue: 4800 },
    { name: 'Apr', revenue: 5500 },
    { name: 'May', revenue: 6100 },
    { name: 'Jun', revenue: 5800 },
    { name: 'Jul', revenue: 6500 },
    { name: 'Aug', revenue: 7200 },
    { name: 'Sep', revenue: 7000 },
    { name: 'Oct', revenue: 7800 },
    { name: 'Nov', revenue: 8500 },
    { name: 'Dec', revenue: 9200 },
  ];
  
  export const profitData = [
    { name: 'Jan', profit: 1500 },
    { name: 'Feb', profit: 2200 },
    { name: 'Mar', profit: 1800 },
    { name: 'Apr', profit: 2500 },
    { name: 'May', profit: 3000 },
    { name: 'Jun', profit: 2700 },
    { name: 'Jul', profit: 3200 },
    { name: 'Aug', profit: 3500 },
    { name: 'Sep', profit: -500 },
    { name: 'Oct', profit: 2000 },
    { name: 'Nov', profit: 3800 },
    { name: 'Dec', profit: 4200 },
  ];
  
  export const revenueByChannel = [
    { name: 'Jan', direct: 1200, affiliate: 800, referral: 400 },
    { name: 'Feb', direct: 1300, affiliate: 900, referral: 450 },
    { name: 'Mar', direct: 1400, affiliate: 950, referral: 500 },
    { name: 'Apr', direct: 1600, affiliate: 1000, referral: 550 },
    { name: 'May', direct: 1700, affiliate: 1050, referral: 600 },
    { name: 'Jun', direct: 1900, affiliate: 1100, referral: 650 },
    { name: 'Jul', direct: 2100, affiliate: 1200, referral: 700 },
    { name: 'Aug', direct: 2300, affiliate: 1300, referral: 750 },
    { name: 'Sep', direct: 2500, affiliate: 1400, referral: 800 },
    { name: 'Oct', direct: 2700, affiliate: 1500, referral: 850 },
    { name: 'Nov', direct: 2900, affiliate: 1600, referral: 900 },
    { name: 'Dec', direct: 3100, affiliate: 1700, referral: 950 },
  ];
  
  export const yearlyFinancials = [
    { name: '2019', revenue: 45000, expenses: 32000, profit: 13000 },
    { name: '2020', revenue: 52000, expenses: 36000, profit: 16000 },
    { name: '2021', revenue: 61000, expenses: 42000, profit: 19000 },
    { name: '2022', revenue: 78000, expenses: 51000, profit: 27000 },
    { name: '2023', revenue: 92000, expenses: 59000, profit: 33000 },
    { name: '2024', revenue: 107000, expenses: 68000, profit: 39000 },
  ];
  
  export const quarterlyGrowth = [
    { name: 'Q1 2023', growth: 8.2 },
    { name: 'Q2 2023', growth: 12.5 },
    { name: 'Q3 2023', growth: 9.7 },
    { name: 'Q4 2023', growth: 15.3 },
    { name: 'Q1 2024', growth: 14.1 },
    { name: 'Q2 2024', growth: 18.6 },
  ];
  
  // Format for currency
  export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Format for percentage
  export const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };