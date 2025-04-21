import React, { useState, useEffect } from "react";
import { IconButton, Badge, Menu, MenuItem, ListItemText, Button, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { getUserNotifications, markNotificationAsRead } from "../services/api";
import { useNavigate } from "react-router-dom";

const NotificationsPopover = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications({ status: "unread", limit: 5 });
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.status === "unread").length;

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleItemClick = (n) => {
    markNotificationAsRead(n.notificationId).then(() => fetchNotifications());
    handleClose();
    navigate(`/loan-officer/applications/${n.linkId}`);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 && <MenuItem disabled>No notifications</MenuItem>}
        {notifications.map(n => (
          <MenuItem key={n.notificationId} onClick={() => handleItemClick(n)}>
            <ListItemText primary={n.message} secondary={new Date(n.createdAt).toLocaleString()} />
            {n.status === "unread" && (
              <Button size="small" onClick={(e) => { e.stopPropagation(); markNotificationAsRead(n.notificationId).then(() => fetchNotifications()); }}>
                Mark read
              </Button>
            )}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { handleClose(); navigate('/notifications'); }}>
          View All
        </MenuItem>
      </Menu>
    </>
  );
};

export default NotificationsPopover;
