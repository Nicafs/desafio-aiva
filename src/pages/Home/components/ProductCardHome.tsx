import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { ApiProduct } from "../../../types/ApiProduct";
import Chip from "@mui/material/Chip";
import { formattedPrice } from "../../../utils/format";
import NoImage from "../../../assets/no-image.png";

type ProductCardHomeProps = {
  product: ApiProduct;
};

export default function ProductCardHome({ product }: ProductCardHomeProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }} key={product.id}>
      <Card
        elevation={1}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 2,
          bgcolor: "#fff",
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: "0 4px 16px 0 rgba(0,0,0,0.10)",
          },
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.images?.[0] || NoImage}
          alt={product.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = NoImage;
          }}
          loading="lazy"
          sx={{
            objectFit: "contain",
            bgcolor: "#f5f5f5",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" noWrap>
            {product.title}
          </Typography>

          <Tooltip title={product.description} placement="top" arrow>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: "3.6em",
              }}
            >
              {product.description}
            </Typography>
          </Tooltip>

          <Chip
            label={product?.category?.name}
            color="primary"
            size="small"
            sx={{ mt: 2 }}
          />

          <Typography
            variant="subtitle1"
            color="success.main"
            fontWeight="bold"
            mt={1}
          >
            {formattedPrice(product.price)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
