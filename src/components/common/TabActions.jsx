import { Box, Tab, Tabs } from '@mui/material';

export default function TabActions({ value, onChangeAction, actions }) {
  const a11yProps = (index) => {
    return {
      id: `product-tab-${index}`,
      'aria-controls': `product-tabpanel-${index}`,
      key: `tab-action-${index}`,
    };
  };

  return (
    <Box sx={{ borderBottom: 1, pt: 2.5, px: 2.5, borderColor: 'divider' }}>
      <Tabs
        value={value}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(event, value) => onChangeAction(value)}
        aria-label="tab actions"
      >
        {actions.map((item, index) => {
          return <Tab disableRipple label={item === '' ? 'All' : item} value={item} {...a11yProps(index)} />;
        })}
      </Tabs>
    </Box>
  );
}
