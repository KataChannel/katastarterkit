# Fix: GraphQL Query Field "quizzes" trên Lesson

## 🐛 Lỗi
```
GraphQL execution errors: Cannot query field "quizzes" on type "Lesson"
```

## ✅ Giải Pháp

### File Đã Sửa

**`backend/src/lms/courses/entities/lesson.entity.ts`**

Thêm field `quizzes` vào GraphQL Lesson entity:

```typescript
import { Quiz } from '../../quizzes/entities/quiz.entity';

@ObjectType()
export class Lesson {
  // ... existing fields ...
  
  @Field(() => [Quiz], { nullable: true })
  quizzes?: Quiz[];
  
  // ... rest ...
}
```

## 🔧 Kết Quả

Schema GraphQL đã được regenerate với field mới:

```graphql
type Lesson {
  id: ID!
  title: String!
  quizzes: [Quiz!]  # ✅ Field mới
  # ... other fields
}
```

## ✅ Hoàn Thành

- [x] Thêm import Quiz entity
- [x] Thêm field quizzes vào Lesson
- [x] Schema GraphQL đã regenerate
- [x] Build thành công
- [x] Frontend query hoạt động

## 🚀 Test

Query sau đây giờ đã hoạt động:

```graphql
mutation {
  generateCourseFromPrompt(prompt: "...") {
    modules {
      lessons {
        quizzes {  # ✅ Không còn lỗi
          id
          title
        }
      }
    }
  }
}
```

---
**Status**: ✅ FIXED
