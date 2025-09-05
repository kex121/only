export const calculateRotation = (selectedIndex: number, dotsCount: number): number => {
  switch (dotsCount) {
    case 2:
      return -90 - selectedIndex * 180;
    case 3:
      return (dotsCount - selectedIndex - 0.5) * (360 / dotsCount);
    case 4:
      return (dotsCount - selectedIndex - 1) * (360 / dotsCount);
    case 5:
      return (dotsCount - selectedIndex - 0.5) * (360 / dotsCount);
    case 6:
      return (dotsCount - selectedIndex - 1) * (360 / dotsCount);
    default:
      return (dotsCount - selectedIndex) * (360 / dotsCount);
  }
};
