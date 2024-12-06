// @mui
import { Stack, Typography } from "@mui/material";
import { connect } from "react-redux";
import DocIllustration from "../../../assets/illustrations/illustration_doc";


function NavbarDocs({ user }) {
  return (
    <Stack
      spacing={3}
      sx={{
        px: 5,
        pb: 5,
        mt: 10,
        width: 1,
        textAlign: "center",
        display: "block",
      }}
    >
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Hi, {user?.first_name + " " + user?.last_name}
        </Typography>
        {/* <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Need help?
          <br /> Please check our docs
        </Typography> */}
      </div>

      {/* <Button
        href={PATH_DOCS}
        target="_blank"
        rel="noopener"
        variant="contained"
      >
        Documentation
      </Button> */}
    </Stack>
  );
}
const mapStateToProps = (state) => {
  return {
    user: state.auth?.user,
  };
};
export default connect(mapStateToProps)(NavbarDocs);
