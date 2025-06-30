const getCount = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0';
  }

  const absNumber = Math.abs(number);
  
  if (absNumber < 1000) {
    return number.toString();
  } else if (absNumber < 1000000) {
    const result = (number / 1000).toFixed(1);
    return result.endsWith('.0') ? result.slice(0, -2) + 'k' : result + 'k';
  } else if (absNumber < 1000000000) {
    const result = (number / 1000000).toFixed(1);
    return result.endsWith('.0') ? result.slice(0, -2) + 'M' : result + 'M';
  } else {
    const result = (number / 1000000000).toFixed(1);
    return result.endsWith('.0') ? result.slice(0, -2) + 'B' : result + 'B';
  }
};

export default getCount;
