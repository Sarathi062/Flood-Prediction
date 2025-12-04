import {
  Drawer,
  Box,
  Typography,
  Divider,
  Button,
  List,
  ListItem,
} from "@mui/material";

export default function NotificationDrawer({
  open,
  onClose,
  onCompleteProfile,
  notifications = [],
}) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 260 } }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Notifications
        </Typography>
      </Box>

      <Divider />

      <List>
        {notifications?.length === 0 && (
          <Typography sx={{ p: 2, opacity: 0.6 }}>No notifications</Typography>
        )}

        {notifications?.map((n) => (
          <ListItem key={n.id} sx={{ display: "block", p: 2 }}>
            <Typography fontWeight={600}>{n.title}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              {n.message}
            </Typography>

            <Typography variant="caption" sx={{ opacity: 0.5 }}>
              {new Date(n.createdAt).toLocaleString()}
            </Typography>

            {/* SPECIAL CASE — COMPLETE ALERT PROFILE */}
            {n.id === "complete-alert-profile" && (
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 1 }}
                onClick={onCompleteProfile}
              >
                Complete Now →
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
