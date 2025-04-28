export const getMinutesAndSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes > 0 ? `${minutes}Min ` : ''}${seconds}Sec`;
};

export const getBadgeStyles = (paceTag: 'Ideal' | 'Too Fast' | 'Overtime') => {
  const styles = {
    Ideal: 'border-[#A16207] bg-[#FEF9C380] text-[#A16207]', // Green for Ideal
    'Too Fast': 'border-[#00A86B] bg-[#00A86B1F] text-[#00A86B]', // Yellow for Too Fast
    Overtime: 'border-[#FF4747] bg-[#FF47471F] text-[#FF4747]' // Red for Overtime
  };

  return styles[paceTag];
};
