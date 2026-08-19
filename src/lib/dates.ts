export function getUpcomingWeekendDates(count = 6) {
  const dates: { value: string; label: string }[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (dates.length < count) {
    const day = cursor.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      const value = cursor.toISOString().slice(0, 10);
      const label = cursor.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      });
      dates.push({ value, label });
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return dates;
}
