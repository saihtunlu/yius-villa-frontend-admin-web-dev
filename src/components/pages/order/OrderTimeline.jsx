// material
import { Card, CardHeader, Paper, Stack, Typography, useTheme } from '@mui/material';
import { Timeline, TimelineDot, TimelineItem, TimelineContent, TimelineSeparator, TimelineConnector } from '@mui/lab';
import Avatar from '../../common/Avatar';
import { fDate, fDateTimeSuffix, fToNow } from '../../../utils/formatTime';
import Label from '../../common/Label';
import Iconify from '../../common/Iconify';

export default function OrderTimeline({ activities, timeline }) {
  const theme = useTheme();
  return (
    <Card>
      <CardHeader title="Activities" />

      <Stack direction={{ lg: 'row', md: 'row', sm: 'column' }} sx={{ p: 1, pt: 0, mb: 2 }} alignItems={'flex-start'}>
        <Timeline>
          {activities.map((item, index) => (
            <TimelineItem
              sx={{
                '&:before': {
                  content: 'none',
                },
                pt: 2,
              }}
              key={`${item.id}-order-timeline`}
            >
              <TimelineSeparator>
                <Avatar
                  sx={{ width: 25, height: 25 }}
                  user={{
                    avatar: item.user_avatar,
                    first_name: item.user_first_name,
                  }}
                />
                {activities.length - 1 !== index && <TimelineConnector sx={{ mt: 1 }} />}
              </TimelineSeparator>
              <TimelineContent sx={{ pt: 0 }}>
                <Typography
                  variant={index === 0 ? 'subtitle3' : 'body2'}
                  sx={{ color: index === 0 ? 'text.primary' : 'text.secondary' }}
                >
                  {item.text}
                </Typography>

                <Stack direction={'row'} alignItems={'center'} spacing={1.5} sx={{ mt: 1 }}>
                  <Label
                    key={item.user_first_name + index}
                    variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  >
                    {item.user_first_name + ' ' + item.user_last_name}
                  </Label>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {fToNow(item.created_at)}
                  </Typography>
                </Stack>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        <Paper variant={'outlined'} sx={{ mr: 2, width: '40%', p: 1, maxWidth: 350 }}>
          <Timeline>
            {timeline.map((item, index) => (
              <TimelineItem
                sx={{
                  '&:before': {
                    content: 'none',
                  },
                }}
                key={`${item.id}-order-timeline`}
              >
                <TimelineSeparator>
                  <TimelineDot color={index === 0 ? 'success' : 'grey'} />
                  {timeline.length - 1 !== index && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Typography
                    variant={index === 0 ? 'subtitle3' : 'body2'}
                    sx={{ color: index === 0 ? 'text.primary' : 'text.secondary' }}
                  >
                    {item.text}
                  </Typography>

                  <Typography component={'p'} variant="caption" sx={{ color: 'text.secondary' }}>
                    {fToNow(item.created_at)}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Paper>
      </Stack>
    </Card>
  );
}
