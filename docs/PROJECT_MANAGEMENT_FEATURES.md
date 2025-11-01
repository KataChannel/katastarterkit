# Tài Liệu Hệ Thống Quản Lý Dự Án - Tính Năng Mới

## 📋 Tổng Quan

Hệ thống quản lý dự án đã được mở rộng với 5 tính năng enterprise chính:

1. **Real-time Chat** - WebSocket chat cho project collaboration
2. **File Attachments** - Upload/quản lý files cho tasks/projects
3. **Advanced Analytics** - Phân tích metrics và insights
4. **Email Notifications** - Thông báo tự động qua email
5. **Calendar Integration** - Lịch task, export iCal

---

## 🚀 Tính Năng Chi Tiết

### 1. Real-time Chat với WebSocket

**File:** `backend/src/project/project-chat.gateway.ts`

**Namespace:** `/project-chat`

**Events Chính:**
- `join_project` - Tham gia room của project
- `leave_project` - Rời room
- `send_message` - Gửi tin nhắn
- `edit_message` - Sửa tin nhắn
- `delete_message` - Xóa tin nhắn
- `message_reaction` - React emoji
- `typing_start` / `typing_stop` - Hiển thị typing indicator
- `online_users` - Danh sách users online
- `load_messages` - Tải lịch sử chat

**Kết nối:**
```typescript
// Frontend (Socket.IO)
const socket = io('http://localhost:3000/project-chat', {
  auth: { token: 'Bearer JWT_TOKEN' }
});

socket.emit('join_project', { projectId: 'uuid' });
socket.emit('send_message', {
  projectId: 'uuid',
  content: 'Hello team!',
  attachments: []
});
```

**Listeners:**
```typescript
socket.on('new_message', (data) => {
  console.log('New message:', data);
});

socket.on('user_joined', ({ userId, userName }) => {
  console.log(`${userName} joined`);
});
```

---

### 2. File Attachments

**Service:** `backend/src/project/project-media.service.ts`  
**Resolver:** `backend/src/project/project-media.resolver.ts`

**Tính năng:**
- Upload files cho Tasks, Projects, Chat messages
- Tích hợp MinIO storage
- Validation: max 10MB, file types (image, document, video)
- Xóa files, list files theo task/project

**GraphQL Mutations:**
```graphql
mutation {
  uploadTaskFile(input: {
    taskId: "uuid"
    files: [...]
  })
  
  deleteProjectFile(input: {
    fileId: "uuid"
  })
}
```

**Lưu ý:** Recommend dùng REST API cho file upload thực tế (multipart/form-data)

**REST Endpoint đề xuất:**
```bash
POST /api/project/upload/task/:taskId
Content-Type: multipart/form-data

# Body: file field
```

---

### 3. Advanced Analytics

**Service:** `backend/src/project/project-analytics.service.ts`  
**Resolver:** `backend/src/project/project-analytics.resolver.ts`

**8 GraphQL Queries:**

```graphql
# 1. Tổng quan dự án
query {
  projectAnalytics(projectId: "uuid")
}
# Returns: { totalTasks, completedTasks, inProgressTasks, pendingTasks, 
#            totalMembers, completionRate, averageCompletionTime }

# 2. Thống kê tasks theo status/priority/category
query {
  taskStatistics(projectId: "uuid")
}

# 3. Hiệu suất members
query {
  memberStatistics(projectId: "uuid")
}
# Returns: [{ userId, tasksAssigned, tasksCompleted, completionRate }]

# 4. Task velocity (tốc độ hoàn thành)
query {
  taskVelocity(projectId: "uuid", days: 30)
}
# Returns: [{ date, tasksCompleted }]

# 5. Project health score (0-100)
query {
  projectHealthScore(projectId: "uuid")
}

# 6. Upcoming deadlines
query {
  upcomingDeadlines(projectId: "uuid", days: 7)
}

# 7. Overdue tasks
query {
  overdueTasks(projectId: "uuid")
}

# 8. Tag statistics
query {
  tagStatistics(projectId: "uuid")
}
# Returns: [{ tag, count }]
```

**Metrics Chính:**
- Completion rate, velocity tracking
- Member performance scoring
- Overdue tracking, deadline alerts
- Category/Tag distribution

---

### 4. Email Notifications

**Service:** `backend/src/project/email.service.ts`

**6 Email Templates:**

1. **Task Assignment** - Khi được assign task
2. **Task Mention** - Khi được @mention trong task
3. **Deadline Reminder** - Nhắc deadline (24h trước)
4. **Task Completed** - Thông báo task hoàn thành
5. **Chat Mention** - @mention trong chat
6. **Daily Digest** - Tổng hợp task hàng ngày

**Methods:**
```typescript
await emailService.sendTaskAssignmentEmail(task, user);
await emailService.sendDeadlineReminderEmail(task, user);
await emailService.sendDailyDigestEmail(user, tasks);
```

**Trạng thái hiện tại:** Placeholder mode (log only, chưa cài nodemailer)

**Setup thật (future):**
```bash
# Install
npm install nodemailer @nestjs-modules/mailer

# .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=app-password
```

---

### 5. Calendar Integration

**Service:** `backend/src/project/calendar.service.ts`  
**Resolver:** `backend/src/project/calendar.resolver.ts`

**GraphQL Queries:**

```graphql
# Month view
query {
  calendarMonthView(year: 2024, month: 5)
}
# Returns: { tasks, tasksByDate, summary }

# Week view
query {
  calendarWeekView(startDate: "2024-05-01")
}

# Export iCal (.ics file)
query {
  exportICalendar(projectId: "uuid")
}
# Returns: iCal format string

# Upcoming tasks (reminders)
query {
  upcomingTasks(hours: 24)
}

# Calendar statistics
query {
  calendarStatistics(
    startDate: "2024-05-01"
    endDate: "2024-05-31"
  )
}
```

**Tính năng:**
- Month/Week/Day view cho tasks
- Export tasks sang iCal format (import vào Google Calendar, Outlook, Apple Calendar)
- Upcoming task reminders
- Statistics theo period
- Overdue tracking

**iCal Export Usage:**
```typescript
// Frontend
const response = await client.query({
  query: EXPORT_ICAL,
  variables: { projectId }
});

const icalData = response.data.exportICalendar;

// Download .ics file
const blob = new Blob([icalData], { type: 'text/calendar' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'my-tasks.ics';
a.click();
```

---

## 🏗️ Kiến Trúc Kỹ Thuật

### Tech Stack

- **Backend:** NestJS + GraphQL
- **Database:** PostgreSQL + Prisma ORM
- **Real-time:** Socket.IO (WebSocket)
- **Storage:** MinIO (S3-compatible)
- **Frontend:** Next.js 14 + TypeScript + shadcn/ui

### Module Structure

```
backend/src/project/
├── project.module.ts           # Main module
├── project.service.ts          # Core project CRUD
├── project.resolver.ts         # GraphQL resolver
├── project-chat.gateway.ts     # WebSocket gateway (545 lines)
├── project-media.service.ts    # File upload service
├── project-media.resolver.ts   # Media GraphQL
├── project-analytics.service.ts # Analytics engine (400+ lines)
├── project-analytics.resolver.ts
├── email.service.ts            # Email notifications
├── calendar.service.ts         # Calendar features (300+ lines)
├── calendar.resolver.ts        # Calendar GraphQL
└── dto/
    └── media.dto.ts            # Media types
```

### Database Models (Prisma)

```prisma
// Chat messages
model ChatMessagePM {
  id          String   @id @default(uuid())
  projectId   String
  userId      String
  content     String
  attachments Json?
  reactions   Json?
  isEdited    Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  project     Project  @relation(...)
  user        User     @relation(...)
}

// File attachments
model TaskMedia {
  id          String   @id @default(uuid())
  taskId      String
  fileName    String
  fileUrl     String
  fileSize    BigInt
  mimeType    String
  uploadedBy  String
  createdAt   DateTime @default(now())
  
  task        Task     @relation(...)
  user        User     @relation(...)
}
```

---

## 🔐 Authentication

Tất cả endpoints đều protected với `JwtAuthGuard`:

```typescript
@UseGuards(JwtAuthGuard)
@Resolver()
export class ProjectResolver {
  @Query()
  async myQuery(@CurrentUser('id') userId: string) {
    // userId tự động từ JWT token
  }
}
```

**Headers:**
```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📊 Performance Considerations

1. **Chat Messages:** Paginated với `take/skip` (default 50 messages)
2. **Analytics:** Cached với TTL (recommend Redis caching)
3. **File Uploads:** Max 10MB per file, validate trước khi upload
4. **WebSocket:** Room-based broadcasting (chỉ users trong project)

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Database migration (nếu có schema changes)
npx prisma migrate dev

# Start server
npm run dev
```

### Frontend Integration Examples

**1. Chat Component:**
```typescript
// components/ProjectChat.tsx
import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/project-chat', {
  auth: { token: `Bearer ${yourJwtToken}` }
});

export function ProjectChat({ projectId }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('join_project', { projectId });
    
    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.emit('leave_project', { projectId });
  }, [projectId]);

  const sendMessage = (content) => {
    socket.emit('send_message', { projectId, content });
  };

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      <input onSubmit={(e) => sendMessage(e.target.value)} />
    </div>
  );
}
```

**2. Analytics Dashboard:**
```typescript
// components/ProjectAnalytics.tsx
const GET_ANALYTICS = gql`
  query ProjectAnalytics($projectId: ID!) {
    projectAnalytics(projectId: $projectId)
    taskVelocity(projectId: $projectId, days: 30)
    projectHealthScore(projectId: $projectId)
  }
`;

export function AnalyticsDashboard({ projectId }) {
  const { data } = useQuery(GET_ANALYTICS, {
    variables: { projectId }
  });

  const analytics = JSON.parse(data?.projectAnalytics || '{}');
  const velocity = JSON.parse(data?.taskVelocity || '[]');
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <CardTitle>Completion Rate</CardTitle>
        <CardContent>{analytics.completionRate}%</CardContent>
      </Card>
      
      <Card>
        <CardTitle>Health Score</CardTitle>
        <CardContent>{data?.projectHealthScore}</CardContent>
      </Card>
      
      <Card>
        <CardTitle>Velocity Chart</CardTitle>
        <LineChart data={velocity} />
      </Card>
    </div>
  );
}
```

**3. Calendar View:**
```typescript
// components/TaskCalendar.tsx
import { Calendar } from '@/components/ui/calendar';

const GET_MONTH = gql`
  query CalendarMonth($year: Int!, $month: Int!) {
    calendarMonthView(year: $year, month: $month)
  }
`;

export function TaskCalendar() {
  const { data } = useQuery(GET_MONTH, {
    variables: { year: 2024, month: 5 }
  });

  const calendarData = JSON.parse(data?.calendarMonthView || '{}');
  const { tasksByDate } = calendarData;

  return (
    <Calendar
      mode="single"
      className="rounded-md border"
      components={{
        Day: ({ day }) => {
          const dateKey = day.toISOString().split('T')[0];
          const tasks = tasksByDate[dateKey] || [];
          
          return (
            <div>
              <span>{day.getDate()}</span>
              {tasks.length > 0 && (
                <Badge>{tasks.length}</Badge>
              )}
            </div>
          );
        }
      }}
    />
  );
}
```

---

## 🎯 Next Steps (Recommendations)

1. **Email Service:** Cài đặt nodemailer + SMTP config
2. **Redis Caching:** Cache analytics queries
3. **File Upload REST API:** Tạo dedicated endpoint cho file uploads
4. **Google Calendar Sync:** OAuth integration
5. **Mobile App:** React Native (đã postpone)
6. **Push Notifications:** Firebase Cloud Messaging
7. **Real-time Analytics:** WebSocket stream cho live metrics

---

## 📝 Environment Variables Cần Thiết

```env
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/db"

# JWT
JWT_SECRET="your-secret-key"

# MinIO
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="project-files"

# Email (future)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="app-password"
EMAIL_FROM="noreply@rausach.com"

# Google Calendar (future)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GOOGLE_REDIRECT_URI=""
```

---

## 🐛 Troubleshooting

**WebSocket không kết nối:**
- Check CORS settings trong main.ts
- Verify JWT token format
- Ensure Socket.IO namespace đúng `/project-chat`

**File upload fail:**
- Check MinIO service running
- Verify bucket exists
- Check file size < 10MB

**Analytics queries slow:**
- Add database indexes
- Implement Redis caching
- Use pagination

**Email không gửi:**
- Hiện tại đang ở placeholder mode
- Install nodemailer + config SMTP để enable

---

## 📚 Tài Liệu Tham Khảo

- **Socket.IO:** https://socket.io/docs/v4/
- **GraphQL:** https://graphql.org/learn/
- **Prisma:** https://www.prisma.io/docs
- **MinIO:** https://min.io/docs/minio/linux/
- **iCal Format:** https://datatracker.ietf.org/doc/html/rfc5545

---

**Phiên bản:** 1.0.0  
**Ngày cập nhật:** May 2024  
**Tác giả:** Rausach Development Team
