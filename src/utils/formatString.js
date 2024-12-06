export const fUsername = (firstName, lastName) => {
  return (
    // eslint-disable-next-line
    (firstName
                                                    .replace(/[^a-zA-Z ]/g, '')
                                                    .replace(/\s+/g, '_')
                                                    .toLowerCase() +
                                                  '_' + lastName
                                                    .replace(/[^a-zA-Z ]/g, '')
                                                    .replace(/\s+/g, '_')
                                                    .toLowerCase())
  );
};

export const fSubdomain = (name) => {
  return name
    .replace(/[^a-zA-Z ]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();
};
export const fAddress = (name) => {
  return name.replaceAll('_', ' ');
};
