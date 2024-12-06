// eslint-disable-next-line import/no-anonymous-default-export
export default function (email) {
  // eslint-disable-next-line
  return email.replace(/(.{2})(.*)(?=@)/, function (_gp1, gp2, gp3) {
    // eslint-disable-next-line
    for (let i = 0; i < gp3.length; i++) {
      gp2 += '*';
    }
    return gp2;
  });
}
