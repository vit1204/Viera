# Luồng Tạo Link Mời & Join Workspace

## 📋 Tổng Quan
Hệ thống cho phép Admin của một workspace tạo link mời để thêm các thành viên mới vào workspace. Người được mời có thể click vào link và chấp nhận lời mời để trở thành member.

---

## 🔄 Luồng Chi Tiết

### **1️⃣ Tạo Invite Link** (Create)

**Điểm bắt đầu:** Component `InviteLink.tsx` → Button "Add member"

```
User (Admin) click "Add member" button
    ↓
Component InviteLink.tsx gọi createInviteLink()
    ↓
Server Action: lib/actions/inviteLink.action.ts
```

**Quá trình trong `createInviteLink()`:**

```typescript
1. Lấy user hiện tại
   ↓
2. Lấy workspaceId từ cookie
   ↓
3. Kiểm tra xem user có phải Admin của workspace không
   → Nếu không → Return error "You don't have permission"
   ↓
4. Kiểm tra xem đã có link mời từ trước chưa?
   → Nếu có → Return existing link
   → Nếu không → Tạo link mới
   ↓
5. Return link object với message "Invite link created successfully!"
```

**Database Query:**
```prisma
// Tìm existing link
inviteLink.findUnique({
  where: { workspaceId, userId: user.id }
})

// Nếu không có thì tạo
inviteLink.create({
  data: { workspaceId, userId: user.id }
})
```

**Schema:**
```prisma
model InviteLink {
  id          String    @id @default(uuid())
  workspaceId String    @unique           // Mỗi workspace chỉ có 1 link
  userId      String    @db.Uuid         // ID của admin tạo link
  user        users     @relation(...)
  Workspace   Workspace @relation(...)
}
```

---

### **2️⃣ Chia Sẻ Link Mời** (Share)

**Component:** `InviteLink.tsx` - Dialog hiển thị link

```
Dialog mở → Hiển thị input có link
    ↓
Input value: https://jiaclone.netlify.app/join/{linkId}
    ↓
User click "Copy" button
    ↓
navigator.clipboard.writeText() 
    ↓
Toast "Invite link copied to clipboard"
    ↓
Admin chia sẻ link cho người khác (email, chat, etc.)
```

**Lưu ý:** 
- Link chỉ được tạo 1 lần (unique per workspace)
- Nếu Admin click "Add member" lần 2, sẽ lấy link cũ (không tạo mới)

---

### **3️⃣ Join Workspace** (Accept)

**Điểm bắt đầu:** User click vào link mời

```
User click: https://jiaclone.netlify.app/join/{linkId}
    ↓
App Router → /app/join/[id]/page.tsx
```

**Component:** `app/join/[id]/page.tsx` (Client Component)

#### **Step 1: Decode Invite Link**
```typescript
const decode = async () => {
  const response = await decodeInviteLink(id)
  // id = linkId từ URL
}
```

**Server Action `decodeInviteLink(id)`:**
```typescript
prisma.inviteLink.findUnique({
  where: { id },
  include: { 
    Workspace: true,    // Lấy info workspace
    user: true          // Lấy info admin tạo link
  }
})
```

**Response:**
```typescript
{
  id: "uuid-xxxxx",
  workspaceId: "workspace-123",
  userId: "admin-user-id",
  Workspace: {
    id: "workspace-123",
    name: "My Team",
    description: "..."
  },
  user: {
    email: "admin@example.com"
  }
}
```

#### **Step 2: Hiển thị Invitation Page**
```
useEffect → Call decode() → Set inviteLink state
    ↓
Hiển thị UI:
  - Avatar của Admin (2 ký tự đầu của email)
  - Tên workspace
  - Nút "Yes, I accept" và "No, thanks"
```

#### **Step 3: Accept Invitation**
```typescript
const handleAccept = async () => {
  const workspaceId = inviteLink?.Workspace.id
  
  // Gọi addMember() để thêm user vào workspace
  const newMember = await addMember(workspaceId, "COLLABORATOR")
  
  if (newMember?.id) {
    setAccepted(true)  // Hiển thị success page
  }
}
```

**Server Action `addMember(workspaceId, role)`:**
```typescript
const user = await getUser()  // Lấy user hiện tại

prisma.workspaceMember.create({
  data: {
    userId: user.id,              // ID người được mời
    workspaceId: workspaceId,
    role: "COLLABORATOR"          // Luôn là COLLABORATOR
  }
})
```

#### **Step 4: Success Page**
```
Hiển thị:
  ✓ Green checkmark
  "Welcome to the team!"
  "You've joined "{Workspace.name}". Check your workspaces list for next steps."
  "Back to Dashboard" button
    ↓
User click → redirect("/")
```

---

## 📊 Database Schema

```prisma
model users {
  id              String    @id @db.Uuid
  email           String?   @unique
  workspaceMembers WorkspaceMember[]
  inviteLinks     InviteLink[]
  profiles        profiles[]
}

model Workspace {
  id              String    @id @default(cuid())
  name            String
  description     String?
  WorkspaceMember WorkspaceMember[]
  inviteLinks     InviteLink[]
}

model WorkspaceMember {
  id          String    @id @default(cuid())
  userId      String    @db.Uuid
  workspaceId String
  role        String    // "ADMIN" | "COLLABORATOR"
  user        users     @relation(fields: [userId], references: [id], onDelete: Cascade)
  Workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}

model InviteLink {
  id          String    @id @default(uuid())
  workspaceId String    @unique
  userId      String    @db.Uuid
  user        users     @relation(fields: [userId], references: [id], onDelete: Cascade)
  Workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}
```

---

## 🔐 Permission Checks

| Action | Điều kiện | Lỗi |
|--------|---------|-----|
| **Tạo Link** | User phải là Admin | "You don't have permission to invite a member" |
| **Decode Link** | Link phải tồn tại | `null` hoặc error |
| **Accept** | User chưa là member | Tạo mới WorkspaceMember |

---

## ⚠️ Edge Cases & Issues

### **1. Người dùng đã là member**
- Nếu user accept link nhưng đã là member → Prisma throw duplicate key error
- **Suggestion:** Thêm check `findUnique` trước khi `create`

### **2. Link bị xóa**
- Nếu workspace bị xóa → InviteLink cũng bị xóa (cascading delete)
- User click link cũ → `decodeInviteLink` return `null`
- **Current:** Chỉ hiển thị loading, không handle null case

### **3. Multiple links per workspace**
- Schema có `@unique` trên `workspaceId`
- Mỗi workspace chỉ có 1 active link
- Nếu Admin click "Add member" nhiều lần → cùng return 1 link

### **4. User không login**
- `decodeInviteLink` có thể gọi từ public (không cần auth)
- `addMember` cần `getUser()` → nếu null sẽ fail

---

## 📝 File Structure

```
lib/actions/
├── inviteLink.action.ts       (createInviteLink, decodeInviteLink)
└── workspaceMember.action.ts  (addMember, checkIsAdmin)

components/
└── InviteLink.tsx             (UI để tạo & copy link)

app/join/
└── [id]/page.tsx              (Join page - accept invitation)

prisma/
└── schema.prisma              (Database schema)
```

---

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CREATE INVITE LINK (Admin)                       │
├─────────────────────────────────────────────────────────────────────┤
│ 1. Admin click "Add member" button                                   │
│ 2. createInviteLink() executed                                       │
│    - Check user & workspace exist                                    │
│    - Check admin permission                                          │
│    - Create or fetch existing InviteLink                             │
│ 3. Display link in Dialog                                            │
│ 4. Admin copy link & share (email, chat, etc.)                       │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                SHARE LINK (External Communication)                   │
├─────────────────────────────────────────────────────────────────────┤
│ URL: https://jiaclone.netlify.app/join/{linkId}                     │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  JOIN WORKSPACE (New Member)                         │
├─────────────────────────────────────────────────────────────────────┤
│ 1. User click link → /join/[id] page                                 │
│ 2. useEffect → decodeInviteLink(id)                                  │
│    - Fetch InviteLink with Workspace & admin user info               │
│    - Display invitation page                                         │
│ 3. User click "Yes, I accept"                                        │
│ 4. addMember(workspaceId, "COLLABORATOR") executed                   │
│    - Create WorkspaceMember record                                   │
│ 5. Display success page                                              │
│ 6. User redirect to dashboard                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📌 Summary

| Phase | Component | Action | Result |
|-------|-----------|--------|--------|
| **Create** | InviteLink.tsx | createInviteLink() | InviteLink record created |
| **Share** | InviteLink.tsx | Copy & send link | URL shared externally |
| **Join** | join/[id]/page.tsx | decodeInviteLink() | Invitation displayed |
| **Accept** | join/[id]/page.tsx | addMember() | WorkspaceMember created |
| **Success** | join/[id]/page.tsx | redirect("/") | User in workspace |
