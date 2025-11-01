# 📚 Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Dự Án

## 📖 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Bắt Đầu Nhanh](#bắt-đầu-nhanh)
3. [Quản Lý Dự Án](#quản-lý-dự-án)
4. [Quản Lý Task](#quản-lý-task)
5. [Chat Realtime](#chat-realtime)
6. [Upload Files](#upload-files)
7. [Phân Tích & Báo Cáo](#phân-tích--báo-cáo)
8. [Lịch & Deadline](#lịch--deadline)
9. [Thông Báo Email](#thông-báo-email)
10. [API Reference](#api-reference)

---

## Giới Thiệu

Hệ thống quản lý dự án là giải pháp toàn diện giúp teams:
- 📋 Quản lý dự án và task hiệu quả
- 💬 Chat realtime với đồng đội
- 📎 Chia sẻ files và tài liệu
- 📊 Theo dõi tiến độ qua analytics
- 📅 Quản lý deadline và lịch làm việc
- 📧 Nhận thông báo qua email

---

## Bắt Đầu Nhanh

### Yêu Cầu

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, cho caching)
- MinIO (cho file storage)

### Cài Đặt Backend

```bash
cd backend

# Install dependencies
bun install

# Setup database
npx prisma migrate dev

# Start server
bun run dev
```

Backend chạy tại: `http://localhost:3000`  
GraphQL Playground: `http://localhost:3000/graphql`

### Cài Đặt Frontend

```bash
cd frontend

# Install dependencies
bun install

# Start dev server
bun run dev
```

Frontend chạy tại: `http://localhost:3001`

---

## Quản Lý Dự Án

### Tạo Dự Án Mới

**GraphQL Mutation:**

```graphql
mutation {
  createProject(input: {
    name: "Website Redesign"
    description: "Thiết kế lại website công ty"
    avatar: "https://example.com/avatar.jpg"
  }) {
    id
    name
    description
    owner {
      id
      firstName
      lastName
    }
    createdAt
  }
}
```

**Frontend Code:**

```typescript
import { useMutation } from '@apollo/client';
import { CREATE_PROJECT } from '@/graphql/mutations';

function CreateProjectForm() {
  const [createProject, { loading }] = useMutation(CREATE_PROJECT);

  const handleSubmit = async (data) => {
    await createProject({
      variables: {
        input: {
          name: data.name,
          description: data.description,
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Tên dự án" />
      <textarea name="description" placeholder="Mô tả" />
      <button type="submit" disabled={loading}>
        Tạo Dự Án
      </button>
    </form>
  );
}
```

### Lấy Danh Sách Dự Án

```graphql
query {
  myProjects {
    id
    name
    description
    avatar
    isArchived
    owner {
      id
      firstName
      lastName
      email
    }
    members {
      id
      role
      user {
        id
        firstName
        lastName
        avatar
      }
    }
    _count {
      tasks
      chatMessages
      members
    }
    createdAt
    updatedAt
  }
}
```

### Thêm Thành Viên Vào Dự Án

```graphql
mutation {
  addProjectMember(input: {
    projectId: "project-uuid"
    userId: "user-uuid"
    role: MEMBER
  }) {
    id
    role
    user {
      firstName
      lastName
      email
    }
  }
}
```

**Roles có sẵn:**
- `OWNER` - Chủ dự án (full quyền)
- `ADMIN` - Quản trị viên
- `MEMBER` - Thành viên thông thường
- `VIEWER` - Chỉ xem

### Cập Nhật Dự Án

```graphql
mutation {
  updateProject(
    id: "project-uuid"
    input: {
      name: "Tên mới"
      description: "Mô tả mới"
      avatar: "https://new-avatar.jpg"
    }
  ) {
    id
    name
    description
    updatedAt
  }
}
```

### Archive Dự Án

```graphql
mutation {
  archiveProject(id: "project-uuid") {
    id
    isArchived
  }
}
```

---

## Quản Lý Task

### Tạo Task

```graphql
mutation {
  createTask(input: {
    title: "Thiết kế UI homepage"
    description: "Tạo mockup cho trang chủ mới"
    projectId: "project-uuid"
    status: PENDING
    priority: HIGH
    category: "Design"
    dueDate: "2024-12-31T23:59:59Z"
    assignedTo: ["user-uuid-1", "user-uuid-2"]
    tags: ["ui", "design", "homepage"]
  }) {
    id
    title
    status
    priority
    dueDate
  }
}
```

**Task Status:**
- `PENDING` - Chờ xử lý
- `IN_PROGRESS` - Đang làm
- `COMPLETED` - Hoàn thành
- `CANCELLED` - Đã hủy

**Priority Levels:**
- `URGENT` - Khẩn cấp
- `HIGH` - Cao
- `MEDIUM` - Trung bình
- `LOW` - Thấp

### Lấy Tasks Của Dự Án

```graphql
query {
  projectTasks(projectId: "project-uuid") {
    id
    title
    description
    status
    priority
    category
    dueDate
    user {
      firstName
      lastName
    }
    assignedTo
    tags
    createdAt
    updatedAt
  }
}
```

### Lấy Tasks Của User

```graphql
query {
  myTasks(
    status: IN_PROGRESS
    priority: HIGH
  ) {
    id
    title
    status
    priority
    dueDate
    project {
      id
      name
    }
  }
}
```

### Cập Nhật Task Status

```graphql
mutation {
  updateTask(
    id: "task-uuid"
    input: {
      status: COMPLETED
    }
  ) {
    id
    status
    updatedAt
  }
}
```

### Assign Task

```graphql
mutation {
  updateTask(
    id: "task-uuid"
    input: {
      assignedTo: ["user-uuid-1", "user-uuid-2"]
    }
  ) {
    id
    assignedTo
  }
}
```

### Tạo Subtask

```graphql
mutation {
  createTask(input: {
    title: "Review code"
    parentId: "parent-task-uuid"
    projectId: "project-uuid"
    status: PENDING
  }) {
    id
    title
    parent {
      id
      title
    }
  }
}
```

---

## Chat Realtime

### Kết Nối WebSocket

```typescript
import io from 'socket.io-client';

const socket = io('http://localhost:3000/project-chat', {
  auth: {
    token: `Bearer ${yourJwtToken}`
  }
});

// Kết nối thành công
socket.on('connect', () => {
  console.log('✅ Connected to chat');
});

// Xử lý lỗi
socket.on('error', (error) => {
  console.error('❌ Chat error:', error);
});
```

### Join Project Room

```typescript
socket.emit('join_project', {
  projectId: 'project-uuid'
});

// Listen for confirmation
socket.on('user_joined', (data) => {
  console.log(`${data.userName} joined the chat`);
});
```

### Gửi Message

```typescript
socket.emit('send_message', {
  projectId: 'project-uuid',
  content: 'Hello team! 👋',
  attachments: [] // Optional file URLs
});

// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
  // message: { id, userId, userName, content, createdAt, ... }
});
```

### Typing Indicators

```typescript
// Bắt đầu typing
socket.emit('typing_start', {
  projectId: 'project-uuid'
});

// Dừng typing
socket.emit('typing_stop', {
  projectId: 'project-uuid'
});

// Listen for typing users
socket.on('user_typing', ({ userId, userName }) => {
  console.log(`${userName} is typing...`);
});

socket.on('user_stopped_typing', ({ userId }) => {
  console.log('User stopped typing');
});
```

### Edit Message

```typescript
socket.emit('edit_message', {
  messageId: 'message-uuid',
  content: 'Updated message content'
});

socket.on('message_edited', (data) => {
  console.log('Message edited:', data);
});
```

### Delete Message

```typescript
socket.emit('delete_message', {
  messageId: 'message-uuid'
});

socket.on('message_deleted', (data) => {
  console.log('Message deleted:', data.messageId);
});
```

### React với Emoji

```typescript
socket.emit('message_reaction', {
  messageId: 'message-uuid',
  emoji: '👍'
});

socket.on('reaction_added', (data) => {
  console.log('Reaction:', data);
  // data: { messageId, userId, emoji }
});
```

### Load Chat History

```typescript
socket.emit('load_messages', {
  projectId: 'project-uuid',
  take: 50,
  skip: 0
});

socket.on('messages_loaded', (messages) => {
  console.log('Chat history:', messages);
});
```

### Xem Users Online

```typescript
socket.on('online_users', (users) => {
  console.log('Online users:', users);
  // users: [{ userId, userName, avatar }, ...]
});
```

### Leave Project Room

```typescript
socket.emit('leave_project', {
  projectId: 'project-uuid'
});

socket.on('user_left', ({ userId, userName }) => {
  console.log(`${userName} left the chat`);
});
```

---

## Upload Files

### Upload File Cho Task

**Recommend: Sử dụng REST API**

```typescript
async function uploadTaskFile(taskId: string, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('taskId', taskId);

  const response = await fetch('http://localhost:3000/api/project/upload/task', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
}
```

**GraphQL Mutation (Placeholder):**

```graphql
mutation {
  uploadTaskFile(input: {
    taskId: "task-uuid"
    caption: "Screenshot của bug"
  })
}
```

### Lấy Files Của Task

```graphql
query {
  taskFiles(taskId: "task-uuid") {
    id
    filename
    url
    size
    mimeType
    uploadedBy
    uploader {
      firstName
      lastName
      avatar
    }
    createdAt
  }
}
```

### Xóa File

```graphql
mutation {
  deleteProjectFile(input: {
    fileId: "file-uuid"
  })
}
```

### Upload File Trong Chat

```typescript
// Upload file trước
const uploadedUrl = await uploadFile(file);

// Gửi message kèm attachment
socket.emit('send_message', {
  projectId: 'project-uuid',
  content: 'Đây là file design',
  attachments: [
    {
      url: uploadedUrl,
      filename: file.name,
      mimeType: file.type,
      size: file.size
    }
  ]
});
```

---

## Phân Tích & Báo Cáo

### Tổng Quan Dự Án

```graphql
query {
  projectAnalytics(projectId: "project-uuid")
}
```

**Kết quả (JSON string):**

```json
{
  "totalTasks": 45,
  "completedTasks": 30,
  "inProgressTasks": 10,
  "pendingTasks": 5,
  "totalMembers": 8,
  "completionRate": 66.67,
  "averageCompletionTime": "3.5 days"
}
```

### Thống Kê Tasks

```graphql
query {
  taskStatistics(projectId: "project-uuid")
}
```

**Kết quả:**

```json
{
  "byStatus": {
    "PENDING": 5,
    "IN_PROGRESS": 10,
    "COMPLETED": 30,
    "CANCELLED": 0
  },
  "byPriority": {
    "URGENT": 2,
    "HIGH": 8,
    "MEDIUM": 20,
    "LOW": 15
  },
  "byCategory": {
    "Design": 12,
    "Development": 18,
    "Testing": 10,
    "Documentation": 5
  }
}
```

### Hiệu Suất Members

```graphql
query {
  memberStatistics(projectId: "project-uuid")
}
```

**Kết quả:**

```json
[
  {
    "userId": "user-1",
    "userName": "Nguyễn Văn A",
    "tasksAssigned": 15,
    "tasksCompleted": 12,
    "completionRate": 80,
    "averageCompletionTime": "2.5 days"
  }
]
```

### Task Velocity (Tốc Độ)

```graphql
query {
  taskVelocity(projectId: "project-uuid", days: 30)
}
```

**Kết quả:**

```json
[
  { "date": "2024-05-01", "tasksCompleted": 3 },
  { "date": "2024-05-02", "tasksCompleted": 5 },
  { "date": "2024-05-03", "tasksCompleted": 2 }
]
```

**Sử dụng cho Chart:**

```typescript
import { LineChart, Line, XAxis, YAxis } from 'recharts';

function VelocityChart({ projectId }) {
  const { data } = useQuery(TASK_VELOCITY, {
    variables: { projectId, days: 30 }
  });

  const chartData = JSON.parse(data?.taskVelocity || '[]');

  return (
    <LineChart data={chartData} width={600} height={300}>
      <XAxis dataKey="date" />
      <YAxis />
      <Line type="monotone" dataKey="tasksCompleted" stroke="#8884d8" />
    </LineChart>
  );
}
```

### Project Health Score

```graphql
query {
  projectHealthScore(projectId: "project-uuid")
}
```

**Kết quả:** `85` (điểm từ 0-100)

**Công thức:**
- Completion rate: 40%
- On-time delivery: 30%
- Member activity: 20%
- Task distribution: 10%

### Tasks Sắp Deadline

```graphql
query {
  upcomingDeadlines(projectId: "project-uuid", days: 7)
}
```

### Tasks Quá Hạn

```graphql
query {
  overdueTasks(projectId: "project-uuid")
}
```

### Thống Kê Theo Tags

```graphql
query {
  tagStatistics(projectId: "project-uuid")
}
```

**Kết quả:**

```json
[
  { "tag": "bug", "count": 12 },
  { "tag": "feature", "count": 18 },
  { "tag": "urgent", "count": 5 }
]
```

---

## Lịch & Deadline

### Xem Lịch Tháng

```graphql
query {
  calendarMonthView(year: 2024, month: 5, projectId: "project-uuid")
}
```

**Kết quả:**

```json
{
  "tasks": [...],
  "tasksByDate": {
    "2024-05-01": [task1, task2],
    "2024-05-05": [task3],
    "2024-05-15": [task4, task5, task6]
  },
  "summary": {
    "total": 25,
    "completed": 15,
    "overdue": 2
  }
}
```

**Frontend Component:**

```typescript
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

function ProjectCalendar({ projectId }) {
  const { data } = useQuery(CALENDAR_MONTH, {
    variables: { year: 2024, month: 5, projectId }
  });

  const calendar = JSON.parse(data?.calendarMonthView || '{}');
  const { tasksByDate } = calendar;

  return (
    <Calendar
      mode="single"
      components={{
        Day: ({ day }) => {
          const dateKey = day.toISOString().split('T')[0];
          const tasks = tasksByDate?.[dateKey] || [];
          
          return (
            <div className="relative">
              <span>{day.getDate()}</span>
              {tasks.length > 0 && (
                <Badge className="absolute top-0 right-0">
                  {tasks.length}
                </Badge>
              )}
            </div>
          );
        }
      }}
    />
  );
}
```

### Xem Lịch Tuần

```graphql
query {
  calendarWeekView(
    startDate: "2024-05-01T00:00:00Z"
    projectId: "project-uuid"
  )
}
```

### Export iCal (.ics)

```graphql
query {
  exportICalendar(projectId: "project-uuid")
}
```

**Kết quả:** iCal format string

**Frontend - Download File:**

```typescript
async function downloadCalendar(projectId: string) {
  const { data } = await client.query({
    query: EXPORT_ICAL,
    variables: { projectId }
  });

  const icalData = data.exportICalendar;
  
  // Create blob and download
  const blob = new Blob([icalData], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `project-tasks-${projectId}.ics`;
  a.click();
  
  URL.revokeObjectURL(url);
}
```

**Import vào Calendar Apps:**
1. Download file `.ics`
2. Mở Google Calendar / Outlook / Apple Calendar
3. Import file .ics
4. Tasks sẽ xuất hiện trong lịch

### Tasks Sắp Đến Hạn (Reminders)

```graphql
query {
  upcomingTasks(hours: 24)
}
```

**Kết quả:** Tasks trong 24h tới

### Thống Kê Lịch

```graphql
query {
  calendarStatistics(
    startDate: "2024-05-01T00:00:00Z"
    endDate: "2024-05-31T23:59:59Z"
    projectId: "project-uuid"
  )
}
```

**Kết quả:**

```json
{
  "total": 45,
  "completed": 30,
  "inProgress": 10,
  "pending": 5,
  "overdue": 3,
  "completionRate": 66.67
}
```

---

## Thông Báo Email

### Cấu Hình Email Service

**Environment Variables:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourcompany.com
```

**Install Package:**

```bash
cd backend
bun add nodemailer @nestjs-modules/mailer
```

### Các Loại Email Tự Động

#### 1. Task Assignment

**Trigger:** Khi user được assign task

**Template:**
```
Subject: Bạn được giao task mới: [Task Title]

Xin chào [User Name],

Bạn vừa được giao task mới trong dự án [Project Name]:

Task: [Task Title]
Priority: [HIGH/MEDIUM/LOW]
Due Date: [Deadline]
Description: [Task Description]

Xem chi tiết: [Link to Task]
```

#### 2. Task Mention (@mention)

**Trigger:** Khi user được @mention trong task description

**Template:**
```
Subject: [User] đã mention bạn trong task

[User Name] đã mention bạn trong task "[Task Title]"

Nội dung: [Task Description]

Xem chi tiết: [Link]
```

#### 3. Deadline Reminder

**Trigger:** 24 giờ trước deadline

**Template:**
```
Subject: ⏰ Nhắc nhở: Task "[Task Title]" sắp đến hạn

Task của bạn sắp đến deadline:
- Task: [Task Title]
- Deadline: [Due Date]
- Status: [Current Status]

Hãy hoàn thành trước deadline!
```

#### 4. Task Completed

**Trigger:** Task được đánh dấu COMPLETED

**Template:**
```
Subject: ✅ Task completed: [Task Title]

Task "[Task Title]" đã được hoàn thành bởi [User Name].

Dự án: [Project Name]
Completed at: [Timestamp]
```

#### 5. Chat Mention

**Trigger:** @mention trong chat

**Template:**
```
Subject: [User] mentioned you in chat

[User Name] đã mention bạn trong chat dự án [Project Name]:

"[Message Content]"

Reply: [Link to Chat]
```

#### 6. Daily Digest

**Trigger:** Hàng ngày lúc 8:00 AM

**Template:**
```
Subject: 📊 Daily Digest - Các task của bạn hôm nay

Xin chào [User],

Tóm tắt tasks của bạn:
- Tasks cần làm hôm nay: 5
- Tasks quá hạn: 2
- Tasks sắp deadline: 3

Chi tiết:
1. [Task 1] - Due: Today
2. [Task 2] - Due: Today
...

Dashboard: [Link]
```

### Tắt/Bật Notifications

```graphql
mutation {
  updateUserSettings(input: {
    emailNotifications: {
      taskAssignment: true
      mentions: true
      deadlineReminder: true
      dailyDigest: false
    }
  })
}
```

---

## API Reference

### GraphQL Endpoints

**Base URL:** `http://localhost:3000/graphql`

### Authentication

Tất cả requests cần JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Lấy Token:**

```graphql
mutation {
  login(input: {
    username: "your-username"
    password: "your-password"
  }) {
    accessToken
    user {
      id
      username
      email
    }
  }
}
```

### Project Queries

```graphql
# Lấy dự án của tôi
query MyProjects {
  myProjects {
    id
    name
    description
    avatar
    isArchived
    owner { ... }
    members { ... }
    _count { tasks, chatMessages, members }
    createdAt
    updatedAt
  }
}

# Lấy chi tiết 1 dự án
query GetProject($id: ID!) {
  project(id: $id) {
    # Same fields as above
  }
}
```

### Project Mutations

```graphql
# Tạo dự án
mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) { ... }
}

# Cập nhật dự án
mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
  updateProject(id: $id, input: $input) { ... }
}

# Archive dự án
mutation ArchiveProject($id: ID!) {
  archiveProject(id: $id) { ... }
}

# Xóa dự án
mutation DeleteProject($id: ID!) {
  deleteProject(id: $id)
}

# Thêm member
mutation AddMember($input: AddMemberInput!) {
  addProjectMember(input: $input) { ... }
}

# Xóa member
mutation RemoveMember($projectId: ID!, $userId: ID!) {
  removeProjectMember(projectId: $projectId, userId: $userId)
}

# Cập nhật role
mutation UpdateRole($input: UpdateMemberRoleInput!) {
  updateMemberRole(input: $input) { ... }
}
```

### Task Queries

```graphql
# Tasks của dự án
query ProjectTasks($projectId: ID!) {
  projectTasks(projectId: $projectId) { ... }
}

# Tasks của tôi
query MyTasks($status: TaskStatus, $priority: String) {
  myTasks(status: $status, priority: $priority) { ... }
}

# Chi tiết task
query GetTask($id: ID!) {
  task(id: $id) { ... }
}
```

### Analytics Queries

```graphql
query Analytics($projectId: ID!) {
  # Tổng quan
  projectAnalytics(projectId: $projectId)
  
  # Thống kê tasks
  taskStatistics(projectId: $projectId)
  
  # Hiệu suất members
  memberStatistics(projectId: $projectId)
  
  # Velocity
  taskVelocity(projectId: $projectId, days: 30)
  
  # Health score
  projectHealthScore(projectId: $projectId)
  
  # Deadlines
  upcomingDeadlines(projectId: $projectId, days: 7)
  overdueTasks(projectId: $projectId)
  
  # Tags
  tagStatistics(projectId: $projectId)
}
```

### Calendar Queries

```graphql
query Calendar {
  # Tháng
  calendarMonthView(year: 2024, month: 5, projectId: "uuid")
  
  # Tuần
  calendarWeekView(startDate: "2024-05-01", projectId: "uuid")
  
  # Export iCal
  exportICalendar(projectId: "uuid")
  
  # Upcoming tasks
  upcomingTasks(hours: 24)
  
  # Statistics
  calendarStatistics(
    startDate: "2024-05-01"
    endDate: "2024-05-31"
    projectId: "uuid"
  )
}
```

### WebSocket Events

**Namespace:** `/project-chat`

**Client → Server:**
- `join_project` - { projectId }
- `leave_project` - { projectId }
- `send_message` - { projectId, content, attachments }
- `edit_message` - { messageId, content }
- `delete_message` - { messageId }
- `message_reaction` - { messageId, emoji }
- `typing_start` - { projectId }
- `typing_stop` - { projectId }
- `load_messages` - { projectId, take, skip }

**Server → Client:**
- `new_message` - { message }
- `message_edited` - { messageId, content, editedAt }
- `message_deleted` - { messageId }
- `reaction_added` - { messageId, userId, emoji }
- `user_joined` - { userId, userName }
- `user_left` - { userId, userName }
- `user_typing` - { userId, userName }
- `user_stopped_typing` - { userId }
- `messages_loaded` - { messages, total }
- `online_users` - { users }
- `error` - { message }

---

## Best Practices

### 1. Security

- ✅ Luôn validate JWT token
- ✅ Check permissions trước khi thực hiện actions
- ✅ Sanitize user input
- ✅ Rate limiting cho API

### 2. Performance

- ✅ Cache analytics queries (Redis)
- ✅ Pagination cho large datasets
- ✅ Lazy load files và media
- ✅ Optimize database indexes

### 3. User Experience

- ✅ Real-time updates với WebSocket
- ✅ Optimistic UI updates
- ✅ Clear error messages
- ✅ Loading states

### 4. Data Management

- ✅ Regular database backups
- ✅ Archive old projects
- ✅ Clean up unused files
- ✅ Monitor storage usage

---

## Troubleshooting

### WebSocket không kết nối

```typescript
// Check CORS settings
// backend/src/main.ts
app.enableCors({
  origin: 'http://localhost:3001',
  credentials: true
});
```

### File upload lỗi

1. Check MinIO service running
2. Verify bucket exists
3. Check file size < 10MB
4. Validate MIME types

### Email không gửi

1. Check SMTP credentials
2. Verify port không bị block
3. Enable "Less secure apps" (Gmail)
4. Use App Password thay vì password thường

### Analytics queries chậm

1. Add database indexes:
```sql
CREATE INDEX idx_task_project ON Task(projectId);
CREATE INDEX idx_task_status ON Task(status);
CREATE INDEX idx_task_duedate ON Task(dueDate);
```

2. Enable Redis caching

---

## Support & Feedback

- 📧 Email: support@yourcompany.com
- 💬 Slack: #project-management
- 🐛 Bug Reports: GitHub Issues
- 📖 Documentation: `/docs`

---

**Version:** 1.0.0  
**Last Updated:** November 2024  
**Maintained by:** Development Team
