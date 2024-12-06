import { Box, Stack, Tab, Tabs, Button, Typography, TextField, IconButton, Tooltip } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { useRef, useState, useEffect } from 'react';

export default function Print({ content }) {
  const [htmlContent, setHtmlContent] = useState('');
  const componentRef = useRef();
  const reactToPrintFn = useReactToPrint({ componentRef });

  useEffect(() => {
    setHtmlContent(content);

    window.setTimeout(() => {
      window.print();
    }, 500); // Add delay to ensure content is ready
    return () => {};
  }, [content]);

  return <div ref={componentRef} className="printable-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}
