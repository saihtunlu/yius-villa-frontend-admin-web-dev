import { ReactNode } from "react";
// material
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";
import LetterLogo from "../../common/LetterLogo";
import useResponsive from "../../../hooks/useResponsive";
// components

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

export default function AuthHeader({ children }) {
  const smUp = useResponsive("up", "sm");

  return (
    <HeaderStyle>
      <LetterLogo />

      {smUp && (
        <Typography
          variant="body2"
          sx={{
            mt: { md: -2 },
          }}
        >
          {children}
        </Typography>
      )}
    </HeaderStyle>
  );
}
