import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ApiProduct } from "../../../../types/ApiProduct";
import NoImage from "../../../../assets/no-image.png";

type ProductCardProps = {
  isLoading?: boolean;
  product: ApiProduct;
  onEdit: (product: ApiProduct) => void;
  onDelete: (id: number) => void;
};

export default function ProductCard({
  isLoading,
  product,
  onEdit,
  onDelete,
}: ProductCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        <Typography gutterBottom variant="h6" component="div" noWrap>
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
              minHeight: "3.6em", // to keep consistent height
            }}
          >
            {product.description}
          </Typography>
        </Tooltip>

        <Typography
          variant="subtitle1"
          color="success.main"
          fontWeight="bold"
          mt={1}
        >
          ${product.price}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={1}
        >
          {product.category?.name}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit(product)}
          fullWidth={true}
          sx={{ maxWidth: "180px" }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(product.id)}
          fullWidth={true}
          loading={isLoading}
          sx={{ maxWidth: "180px" }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
