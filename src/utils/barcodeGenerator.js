const barcodeGenerator = (preFix) => {
  const timestamp = (new Date() / 100).toFixed(0);
  const randomInt = Math.floor(Math.random() * 100);
  const str = `${timestamp}`.substring(timestamp.length - 6);
  return preFix + str + randomInt;
};

export default barcodeGenerator;
