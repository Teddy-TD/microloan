import { Container, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

const Gallery = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h3" sx={{ mt: 5 }}>
          Gallery Page
        </Typography>
        <Typography>This is Gallery page content.</Typography>
      </Container>
    </>
  );
};

export default Gallery;
