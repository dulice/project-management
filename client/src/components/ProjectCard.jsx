import {
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  AvatarGroup,
  Avatar,
  IconButton,
  Chip,
} from "@mui/material";
import { MoreVert } from '@mui/icons-material'
import { green } from "@mui/material/colors";
import { Link } from "react-router-dom";
import {DoneProgress} from ".";

export function getRandomNumber() {
  const min = 0;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString().padStart(6, '0');
}

const ProjectCard = ({ project }) => {
  
  return (
    <>
      <Card sx={{mb: 3}}>
        <CardContent>
          <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
              <Avatar src={project.image} />
              <Typography variant="h5">{project.title}</Typography>
            </Box>
            <Link to={`/projects/${project.id}`}>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Link>
          </Box>
         <Chip label={project.status} sx={{mb: 3, mt: 1, color: green[700]}}/>
          <Typography paragraph sx={{lineHeight: "1.5rem", height: "3rem", overflow: "hidden", textOverflow: "ellipsis"}}>{project.description}</Typography>
          <DoneProgress tasks={project.tasks} />
          <Box>
            {project.languages.map((language, index) => (
              <Typography
                key={index}
                variant="caption"
                sx={{
                  fontWeight: "bold",
                  mr: 1,
                  color: `#${getRandomNumber()}`,
                }}
              >
                #{language}
              </Typography>
            ))}
          </Box>
        </CardContent>
        <CardActions>
          <AvatarGroup max={6}>
            {project.members.map((member) => (
              <Avatar key={member.id} src={member.photo} />
            ))}
          </AvatarGroup>
        </CardActions>
      </Card>
    </>
  );
};

export default ProjectCard;
