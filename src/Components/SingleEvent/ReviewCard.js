import React, { useState, useCallback } from "react";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Rating from "@mui/material/Rating";
import Collapse from "@mui/material/Collapse";
import { styled } from "@mui/material/styles";
import FilterVintageIcon from "@mui/icons-material/FilterVintage";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#D59E20",
  },
  "& .MuiRating-iconHover": {
    color: "#faaf00",
  },
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function ReviewCard(props) {
  const review = props.review;
  const [expanded, setExpanded] = useState(false);

  const handleExpand = useCallback(async () => {
    setExpanded((expanded) => !expanded);
  }, []);

  return (
    <Card
      className="review-card"
      raised={true}
      sx={{
        borderRadius: 0,
        backgroundColor: "#FFFEF9",
      }}
    >
      <CardHeader
        avatar={<Avatar alt={review.User.name} src={review.User.imageUrl} />}
        title={review.User.name}
        subheader={
          <StyledRating
            readOnly
            name="user-rating"
            value={review.rating}
            precision={0.5}
            size="medium"
            icon={<FilterVintageIcon fontSize="inherit" />}
            emptyIcon={<FilterVintageIcon fontSize="inherit" />}
          />
        }
        action={
          <ExpandMore
            expand={expanded}
            onClick={handleExpand}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        }
      />
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className="review-text">{review.content}</CardContent>
      </Collapse>
    </Card>
  );
}
