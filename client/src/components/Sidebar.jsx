import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Dashboard,
  Backpack,
  Task,
  LockClock,
  Report,
  Settings,
  ManageHistory,
  Group,
  Today
} from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";

const sideBarMenu = [
  { id: 1, name: "Dashboard", Icon: Dashboard, link: "/" },
  { id: 2, name: "Projects", Icon: Backpack, link: "/projects" },
  { id: 3, name: "Tasks", Icon: Task, link: "/tasks" },
  { id: 4, name: "Calendar", Icon: Today, link: "/calendar" },
  { id: 5, name: "Employee", Icon: Group, link: "/employee" },
];

const Sidebar = ({isMobile}) => {
  const { pathname } = useLocation();

  const hideRoutes = ['/signin'];

  if(hideRoutes.includes(pathname)) return null;
  return (
    <>
      <Drawer anchor="left" variant="permanent">
        <Box sx={{textAlign: "center", mt: 2}}>
          <Link to="/">
            <ManageHistory color="warning"/>
          </Link>
        </Box>
        <List>
          {sideBarMenu.map((menu) => (
            <Box
              key={menu.id}
              className={`${pathname === menu.link && "active"}`}
              py={1}
            >
              <ListItemButton>
                <Link
                  to={menu.link}
                  style={{ display: "flex", color: "inherit" }}
                >
                  <menu.Icon />
                  {!isMobile && <ListItemText primary={menu.name} sx={{ ml: 3 }} />}
                </Link>
              </ListItemButton>
            </Box>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
