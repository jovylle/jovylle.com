# 🔔 Widget Notification API

## Quick Start

The Jovylle Widget now includes a powerful notification system that allows host websites to display alerts, messages, and updates to visitors.

## Installation

```html
<!-- Load the widget -->
<script 
  src="https://jovylle.com/widget/embed-inline.js"
  data-position="bottom-right"
  data-size="medium"
  async>
</script>
```

## API Reference

### `addNotification(options)`

Adds a new notification to the widget.

**Parameters:**
```javascript
{
  type: string,       // 'info', 'success', 'warning', 'error'
  title: string,      // Notification title
  message: string,    // Notification message body
  persistent: boolean // true = stays until dismissed, false = auto-removes after 10s
}
```

**Returns:** `string` - Notification ID

**Example:**
```javascript
const id = window.JovylleInlineWidget.addNotification({
  type: 'success',
  title: 'Welcome!',
  message: 'Thanks for visiting our site.',
  persistent: true
});
```

---

### `removeNotification(id)`

Removes a specific notification.

**Parameters:**
- `id` - Notification ID (string) or index (number)

**Example:**
```javascript
window.JovylleInlineWidget.removeNotification(id);
```

---

### `clearAllNotifications()`

Removes all notifications at once.

**Example:**
```javascript
window.JovylleInlineWidget.clearAllNotifications();
```

---

### `getNotifications()`

Gets all current notifications.

**Returns:** `Array` - Array of notification objects

**Example:**
```javascript
const notifications = window.JovylleInlineWidget.getNotifications();
console.log(`You have ${notifications.length} notifications`);
```

---

## Notification Types

### Info (Blue)
General information, announcements, tips
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'info',
  title: 'New Feature',
  message: 'Check out our new dashboard!',
  persistent: true
});
```

### Success (Green)
Success messages, confirmations
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'success',
  title: 'Saved',
  message: 'Your changes have been saved.',
  persistent: false
});
```

### Warning (Yellow)
Warnings, cautions, important notices
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'warning',
  title: 'Maintenance',
  message: 'Scheduled maintenance tonight at 2 AM.',
  persistent: true
});
```

### Error (Red)
Errors, critical alerts
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'error',
  title: 'Connection Failed',
  message: 'Unable to reach server. Please try again.',
  persistent: true
});
```

---

## Real-World Examples

### Welcome Message
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'success',
  title: '👋 Welcome!',
  message: 'Thanks for joining us. Explore the Quick Links tab.',
  persistent: true
});
```

### System Status Alert
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'warning',
  title: 'High Traffic',
  message: 'We\'re experiencing high traffic. Some features may be slower.',
  persistent: true
});
```

### Form Submission Success
```javascript
// After form submission
fetch('/api/submit', { method: 'POST', body: formData })
  .then(response => {
    if (response.ok) {
      window.JovylleInlineWidget.addNotification({
        type: 'success',
        title: 'Form Submitted',
        message: 'We\'ll get back to you within 24 hours.',
        persistent: false
      });
    }
  });
```

### Error Handling
```javascript
fetch('/api/data')
  .catch(error => {
    window.JovylleInlineWidget.addNotification({
      type: 'error',
      title: 'Load Failed',
      message: 'Unable to load data. Please refresh the page.',
      persistent: true
    });
  });
```

### Time-Sensitive Promotion
```javascript
window.JovylleInlineWidget.addNotification({
  type: 'info',
  title: '🎉 Flash Sale',
  message: '50% off for the next 2 hours!',
  persistent: false  // Auto-dismiss after 10s
});
```

---

## Features

- ✅ **Badge Counter** - Shows unread count on Alerts tab
- ✅ **Persistence** - Saved to localStorage
- ✅ **Auto-dismiss** - Non-persistent notifications auto-remove
- ✅ **Dark Mode** - Adapts to theme automatically
- ✅ **Timestamps** - Each notification shows creation time
- ✅ **Limit** - Max 50 notifications (oldest removed first)

---

## Widget Control

### Open Widget
```javascript
window.JovylleInlineWidget.open();
```

### Switch to Notifications Tab
```javascript
window.JovylleInlineWidget.switchTab('notifications');
```

### Open & Show Notifications
```javascript
window.JovylleInlineWidget.open();
window.JovylleInlineWidget.switchTab('notifications');
```

---

## Testing

Visit the demo page to test the notification system:
```
https://jovylle.com/widget/demo-notifications.html
```

Or test locally:
```
http://localhost:3000/widget/demo-notifications.html
```

---

## Browser Support

Works in all modern browsers:
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Opera 67+

---

## Best Practices

1. **Use appropriate types** - Match notification type to the message
2. **Keep titles short** - 2-5 words ideal
3. **Clear messages** - Be concise and actionable
4. **Use persistent wisely** - Important info = true, temp = false
5. **Don't spam** - Limit notifications to meaningful events
6. **Test on mobile** - Ensure notifications are readable on small screens

---

## Support

Questions or issues? 
- 📧 Email: hello@jovylle.com
- 🌐 Website: https://jovylle.com
- 📝 Docs: https://jovylle.com/docs/widget_overview

---

*Last updated: November 2025*





