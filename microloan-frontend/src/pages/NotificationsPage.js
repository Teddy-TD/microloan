import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Pagination } from "@mui/material";
import { getUserNotifications, markNotificationAsRead } from "../services/api";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const data = await getUserNotifications({ page, limit });
      setNotifications(data.notifications);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRowClick = (n) => {
    navigate(`/loan-officer/applications/${n.linkId}`);
  };

  return (
    <Box sx={{ py: 5, backgroundColor: "#F5F7FA", minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mb: 3 }}>
          Notifications
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : notifications.length === 0 ? (
          <Typography>No notifications</Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Message</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n.notificationId} hover onClick={() => handleRowClick(n)} sx={{ cursor: "pointer" }}>
                    <TableCell>{n.message}</TableCell>
                    <TableCell>{new Date(n.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{n.status}</TableCell>
                    <TableCell>
                      {n.status === "unread" && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkRead(n.notificationId);
                          }}
                        >
                          Mark Read
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} />
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
};

export default NotificationsPage;
