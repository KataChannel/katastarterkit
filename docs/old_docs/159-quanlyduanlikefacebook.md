STT,Tính năng,Mô tả chi tiết (DEV phải hiểu),API Endpoint,UI Component
1,Đăng nhập / Đăng ký,Email + Google OAuth,"POST /auth/login, /auth/google",LoginScreen
2,Tạo & Hiển thị Dự án,Sidebar trái: danh sách dự án (như Group),"GET /projects, POST /projects",ProjectSidebar
3,Tạo Task như Post,Nút “Tạo việc mới” → popup form,POST /tasks,CreateTaskModal
4,Task Feed (giữa),"Task hiển thị theo feed, sắp xếp ưu tiên",GET /tasks?projectId=&sort=priority,TaskFeed
5,Chat theo Dự án (phải),Chat nhóm + chat riêng,"GET /messages?projectId=, POST /messages",ChatPanel
6,Thông báo @mention,@tên → push notification + tạo task,WebSocket + POST /notifications,MentionHandler


+--------------------+-------------------------+---------------------+
|     TRÁI (25%)     |     GIỮA (50%)          |     PHẢI (25%)      |
+--------------------+-------------------------+---------------------+
| [Avatar]           | [Tạo việc mới...]       | [Chat dự án: #UI]   |
| Dự án của tôi      | ----------------------- | ------------------- |
| • #Website Redesign| > Task: Hoàn thành UI   | Anh: Ok, gửi mockup |
|   (80% ✅)          |   @Bạn - Hôm nay        | Bạn: Đã gửi!        |
| • #Mobile App      |   [ ] Checklist         |                     |
|   (45% ⚠️)         |   [Attach: mockup.png]  |                     |
| + Tạo dự án mới    |                         |                     |
+--------------------+---^---------------------+---------------------+
                        |
                  [Tạo task như đăng bài]

[≡] → Mở menu trái (dự án)
[📝] → Mở form tạo task
[💬] → Mở chat phải
→ Task feed chiếm full màn hình

LUỒNG TẠO TASK
1. User click "Tạo việc mới"
2. Mở Modal:
   - Tiêu đề (bắt buộc)
   - Mô tả (rich text)
   - Gán cho: @mention → dropdown user trong project
   - Ưu tiên: [Cao] [Trung] [Thấp]
   - Deadline: date picker
   - Checklist: + thêm dòng
   - Attach file: drag & drop
   - Tag dự án (tự động theo project hiện tại)
3. Submit → POST /tasks → trả về taskId
4. Realtime: push task mới vào TaskFeed (WebSocket)
5. Nếu có @mention → tạo Notification + gửi email

SẮP XẾP TASK FEED (THUẬT TOÁN ƯU TIÊN)
sortScore = 
  (priority === 'high' ? 300 : priority === 'medium' ? 200 : 100) +
  (dueDate < today ? 500 : 0) + // quá hạn = ưu tiên cao nhất
  (1000 - order) // drag & drop điều chỉnh
                 
Tuần,Mục tiêu
1,"Setup project, auth, UI skeleton"
2,Project CRUD + Sidebar
3,Task CRUD + Create Modal
4,Task Feed + sorting + drag & drop
5,Chat realtime (Socket.io)
6,@mention + notification
7,Mobile responsive + PWA
8,Test + Deploy + Demo                 