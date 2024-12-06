import { Paper, PaperProps, Typography } from '@mui/material';
import NotFoundIllustration from '../../assets/illustrations/illustration_not_found';

export default function SearchNotFound({ searchQuery = '', hideCaption = false, ...other }) {
  return (
    <Paper {...other}>
      <NotFoundIllustration sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }} />
      {!hideCaption && (
        <>
          {' '}
          <Typography gutterBottom mt={2.5} align="center" variant="subtitle1">
            Not found
          </Typography>
          <Typography variant="body2" align="center">
            No results found for &nbsp;
            <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using complete words.
          </Typography>
        </>
      )}
    </Paper>
  );
}
