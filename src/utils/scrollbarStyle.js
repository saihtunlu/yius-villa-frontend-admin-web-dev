import { alpha } from '@mui/material/styles';

// for chrome based browser
export const addScrollbarStyle = (theme) => {
  // eslint-disable-next-line
  let style = document.createElement('style');
  const styles = `
/* Scrollbar */
*::-webkit-scrollbar,
*::-webkit-scrollbar-thumb {
  width: 6px;
  height: 7px;
}
*:hover::-webkit-scrollbar-thumb,
*::-webkit-scrollbar-thumb:hover {
  background: ${alpha(theme.palette.grey[600], 0.3)} !important;
  border-radius: 10px !important;
}
/* Track */
*::-webkit-scrollbar-track {
  background: transparent !important;
}
  `;
  style.appendChild(document.createTextNode(styles));
  document.getElementsByTagName('head')[0].appendChild(style);
};
