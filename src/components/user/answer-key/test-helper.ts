import { chapterwiseTestMockData, conceptTestMockData, generateTestMockData, AIM_PYT_TEST } from './mock-data';

// Helper function to get mock data based on test type
export const getMockDataByTestType = (testTypeId: number) => {
  switch (testTypeId) {
    case 1:
      return AIM_PYT_TEST;
    case 3:
      return generateTestMockData;
    case 4:
      return chapterwiseTestMockData;
    case 5:
      return conceptTestMockData;
    default:
      return [];
  }
};

// Function to check if we should use mock data
export const shouldUseMockData = (testTypeId: number) => {
  // For development/testing purposes, you can return true
  // In production, you might want to check for specific conditions
  return [3, 4, 5].includes(testTypeId);
};
