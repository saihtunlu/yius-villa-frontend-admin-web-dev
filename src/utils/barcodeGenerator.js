const barcodeGenerator = (preFix) => {
  const timestamp = (new Date() / 100).toFixed(0);
  const str = `${timestamp}`.substring(timestamp.length - 6);
  return preFix + str;
};

export default barcodeGenerator;
