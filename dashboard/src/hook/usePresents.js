/**
 * A custom hook for managing presents.
 *
 * @param {Object} options - The options for managing presents.
 * @param {number} options.total - The total number of presents.
 * @param {number} options.min - The minimum number of presents.
 */
export const usePresents = ({ total, min }) => {
  if (min <= 0) return 0;
  return (min / total) * 100;
};
