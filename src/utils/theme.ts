export function getActiveTheme(): string {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();

  // Valentine's Day: Feb 14 (Visible Feb 7 - Feb 14)
  const valentinesStart = new Date(currentYear, 1, 7);
  const valentinesEnd = new Date(currentYear, 1, 14, 23, 59, 59);
  if (currentDate >= valentinesStart && currentDate <= valentinesEnd) {
    return 'theme-valentines';
  }

  // Women's Day: March 8 (Visible March 1 - March 8)
  const womensDayStart = new Date(currentYear, 2, 1);
  const womensDayEnd = new Date(currentYear, 2, 8, 23, 59, 59);
  if (currentDate >= womensDayStart && currentDate <= womensDayEnd) {
    return 'theme-womens-day';
  }

  // Pride Month: June (Visible May 25 - June 30)
  const prideStart = new Date(currentYear, 4, 25);
  const prideEnd = new Date(currentYear, 5, 30, 23, 59, 59);
  if (currentDate >= prideStart && currentDate <= prideEnd) {
    return 'theme-pride';
  }

  // Christmas: Dec 25 (Visible Dec 1 - Dec 25)
  const christmasStart = new Date(currentYear, 11, 1);
  const christmasEnd = new Date(currentYear, 11, 25, 23, 59, 59);
  if (currentDate >= christmasStart && currentDate <= christmasEnd) {
    return 'theme-christmas';
  }

  return 'theme-default';
}
