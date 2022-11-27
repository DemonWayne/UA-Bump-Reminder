export const formattingTime = (duration: number) => {
  let str = '';
  const days = Math.floor(duration / (24 * 60 * 60 * 1000));
  if (days !== 0) {
    if (days % 10 === 1 && days !== 11) str += `${days} день `;
    else if (days % 10 === 0 || (days >= 11 && days <= 14) || days % 10 >= 5) str += `${days} днів `;
    else if (days % 10 <= 4) str += `${days} дні `;
  }
  duration %= 24 * 60 * 60 * 1000;
  const hours = Math.floor(duration / (60 * 60 * 1000));
  if (hours !== 0) {
    if (hours % 10 === 1 && hours !== 11) str += `${hours} година `;
    else if (hours % 10 === 0 || (hours >= 11 && hours <= 14) || hours % 10 >= 5) str += `${hours} годин `;
    else if (hours % 10 <= 4) str += `${hours} години `;
  }
  duration %= 60 * 60 * 1000;
  const minutes = Math.floor(duration / (60 * 1000));
  if (minutes !== 0) {
    if (minutes % 10 === 1 && minutes !== 11) str += `${minutes} хвилина `;
    else if (minutes % 10 === 0 || (minutes >= 11 && minutes <= 14) || minutes % 10 >= 5) str += `${minutes} хвилин `;
    else if (minutes % 10 <= 4) str += `${minutes} хвилини `;
  }
  duration %= 60 * 1000;
  const seconds = Math.floor(duration / 1000);
  if (seconds !== 0) {
    if (seconds % 10 === 1 && seconds !== 11) str += `${seconds} секунда `;
    else if (seconds % 10 === 0 || (seconds >= 11 && seconds <= 14) || seconds % 10 >= 5) str += `${seconds} секунд `;
    else if (seconds % 10 <= 4) str += `${seconds} секунди `;
  }
  return str.trim();
};
