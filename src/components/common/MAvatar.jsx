import { forwardRef } from "react";
import { useTheme } from "@mui/material/styles";
import { Avatar as MUIAvatar, AvatarProps } from "@mui/material";

const MAvatar = forwardRef(
  ({ color = "default", children, sx, ...other }, ref) => {
    const theme = useTheme();

    if (color === "default") {
      return (
        <MUIAvatar ref={ref} sx={sx} {...other}>
          {children}
        </MUIAvatar>
      );
    }

    return (
      <MUIAvatar
        ref={ref}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
          ...sx,
        }}
        {...other}
      >
        {children}
      </MUIAvatar>
    );
  }
);

export default MAvatar;
