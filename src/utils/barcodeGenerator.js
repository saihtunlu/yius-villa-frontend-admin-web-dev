const barcodeGenerator = (preFix) => {
  // Get the current timestamp in milliseconds
  const timestamp = Date.now().toString();

  // Extract the last 6 digits of the timestamp for uniqueness
  const uniquePart = timestamp.slice(-6);

  // Generate a random number between 100 and 999 for added randomness
  const randomPart = Math.floor(100 + Math.random() * 900);

  // Combine prefix, unique timestamp part, and random part
  return `${preFix}${uniquePart}${randomPart}`;
};

export default barcodeGenerator;
