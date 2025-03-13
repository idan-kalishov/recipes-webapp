import React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { red } from '@mui/material/colors';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// Define the props that our Post component will receive.
interface PostProps {
  title: string;
  image: string;
  content: string;
  method: string;
  avatarLetter?: string;
  onFavorite?: () => void;
  onShare?: () => void;
}

const Post: React.FC<PostProps> = ({
                                     title,
                                     image,
                                     content,
                                     method,
                                     avatarLetter = 'P',
                                     onFavorite,
                                     onShare,
                                   }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded((prev) => !prev);
  };

  return (
      <Card sx={{ maxWidth: 345, margin: 'auto', mb: 2 }}>
        <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="post">
                {avatarLetter}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={title}
        />
        <CardMedia
            component="img"
            height="194"
            image={image}
            alt={title}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {content}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites" onClick={onFavorite}>
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share" onClick={onShare}>
            <ShareIcon />
          </IconButton>
          <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Method:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {method}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
  );
};

export default Post;
