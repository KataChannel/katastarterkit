(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,169989,162207,e=>{"use strict";let t=(0,e.i(930702).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);e.s(["default",()=>t],162207),e.s(["Loader2",()=>t],169989)},295426,e=>{"use strict";let t=(0,e.i(930702).default)("arrow-left",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);e.s(["default",()=>t])},519647,e=>{"use strict";var t=e.i(295426);e.s(["ArrowLeft",()=>t.default])},813046,e=>{"use strict";let t=(0,e.i(930702).default)("save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);e.s(["default",()=>t])},553082,e=>{"use strict";var t=e.i(813046);e.s(["Save",()=>t.default])},979426,e=>{"use strict";let t=(0,e.i(930702).default)("upload",[["path",{d:"M12 3v12",key:"1x0j5s"}],["path",{d:"m17 8-5-5-5 5",key:"7q97r8"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}]]);e.s(["default",()=>t])},455461,e=>{"use strict";var t=e.i(979426);e.s(["Upload",()=>t.default])},492055,e=>{"use strict";var t=e.i(984804);let s=t.gql`
  fragment CourseBasic on Course {
    id
    title
    slug
    description
    thumbnail
    price
    level
    status
    duration
    avgRating
    enrollmentCount
    reviewCount
    createdAt
    publishedAt
  }
`,r=t.gql`
  fragment CourseDetail on Course {
    ...CourseBasic
    trailer
    metaTitle
    metaDescription
    tags
    whatYouWillLearn
    requirements
    targetAudience
    instructorId
  }
  ${s}
`,l=t.gql`
  query GetCourses($filters: CourseFiltersInput) {
    courses(filters: $filters) {
      data {
        ...CourseBasic
        categoryId
        instructor {
          id
          username
          firstName
          lastName
          avatar
        }
      }
      total
      page
      limit
      totalPages
    }
  }
  ${s}
`,a=t.gql`
  query GetCourseBySlug($slug: String!) {
    courseBySlug(slug: $slug) {
      ...CourseDetail
      categoryId
      instructor {
        id
        username
        firstName
        lastName
        avatar
      }
      modules {
        id
        title
        description
        order
        lessons {
          id
          title
          type
          duration
          order
          isFree
        }
      }
    }
  }
  ${r}
`,i=t.gql`
  query GetMyCourses {
    myCourses {
      ...CourseBasic
      categoryId
    }
  }
  ${s}
`,n=t.gql`
  query GetEnrollment($courseId: ID!) {
    enrollment(courseId: $courseId) {
      id
      userId
      courseId
      status
      progress
      enrolledAt
      completedAt
      lessonProgress {
        id
        lessonId
        completed
        completedAt
      }
    }
  }
`,d=t.gql`
  query GetCourseCategories {
    courseCategories {
      id
      name
      slug
      description
      icon
      parentId
    }
  }
`;t.gql`
  query GetCourseCategoryTree {
    courseCategoryTree {
      id
      name
      slug
      icon
      children {
        id
        name
        slug
        icon
      }
    }
  }
`;let o=t.gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(createCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${r}
`,u=t.gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(updateCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${r}
`;t.gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`,t.gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`,t.gql`
  mutation MarkLessonComplete($enrollmentId: ID!, $lessonId: ID!) {
    markLessonComplete(enrollmentId: $enrollmentId, lessonId: $lessonId) {
      id
      lessonId
      completed
      completedAt
    }
  }
`,t.gql`
  mutation CreateModule($input: CreateModuleInput!) {
    createModule(input: $input) {
      id
      title
      description
      order
      courseId
      lessons {
        id
        title
        type
        order
      }
    }
  }
`,t.gql`
  mutation UpdateModule($input: UpdateModuleInput!) {
    updateModule(input: $input) {
      id
      title
      description
      order
    }
  }
`,t.gql`
  mutation DeleteModule($id: ID!) {
    deleteModule(id: $id)
  }
`,t.gql`
  mutation ReorderModules($input: ReorderModulesInput!) {
    reorderModules(input: $input) {
      id
      title
      order
      lessons {
        id
        title
        order
      }
    }
  }
`,t.gql`
  mutation CreateLesson($input: CreateLessonInput!) {
    createLesson(input: $input) {
      id
      title
      description
      type
      content
      duration
      order
      moduleId
    }
  }
`,t.gql`
  mutation UpdateLesson($input: UpdateLessonInput!) {
    updateLesson(input: $input) {
      id
      title
      description
      type
      content
      duration
      order
    }
  }
`,t.gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`,t.gql`
  mutation ReorderLessons($input: ReorderLessonsInput!) {
    reorderLessons(input: $input) {
      id
      title
      order
    }
  }
`,e.s(["CREATE_COURSE",0,o,"GET_COURSES",0,l,"GET_COURSE_BY_SLUG",0,a,"GET_COURSE_CATEGORIES",0,d,"GET_ENROLLMENT",0,n,"GET_MY_COURSES",0,i,"UPDATE_COURSE",0,u])},980274,e=>{"use strict";var t=e.i(44990),s=e.i(403055),r=e.i(950988),l=e.i(429105),a=e.i(984804),i=e.i(492055),n=e.i(130775),d=e.i(579448),o=e.i(519647),u=e.i(553082),c=e.i(455461),m=e.i(888540),g=e.i(169989);let p=a.gql`
  query GetCourseById($id: ID!) {
    course(id: $id) {
      id
      title
      slug
      description
      thumbnail
      trailer
      price
      level
      status
      duration
      metaTitle
      metaDescription
      tags
      whatYouWillLearn
      requirements
      targetAudience
      categoryId
    }
  }
`;function h(){let e=(0,n.useRouter)(),a=(0,n.useParams)(),h=a?.id,[x,b]=(0,s.useState)({title:"",description:"",thumbnail:"",trailer:"",price:0,level:"BEGINNER",status:"DRAFT",duration:0,metaTitle:"",metaDescription:"",tags:[],whatYouWillLearn:[],requirements:[],targetAudience:[],categoryId:""}),[y,f]=(0,s.useState)(""),[v,j]=(0,s.useState)(""),[N,C]=(0,s.useState)(""),[w,I]=(0,s.useState)(""),[k,T]=(0,s.useState)({}),{data:E,loading:q}=(0,l.useQuery)(p,{variables:{id:h},skip:!h,onCompleted:e=>{if(e?.course){let t=e.course;b({title:t.title||"",description:t.description||"",thumbnail:t.thumbnail||"",trailer:t.trailer||"",price:t.price||0,level:t.level||"BEGINNER",status:t.status||"DRAFT",duration:t.duration||0,metaTitle:t.metaTitle||"",metaDescription:t.metaDescription||"",tags:t.tags||[],whatYouWillLearn:t.whatYouWillLearn||[],requirements:t.requirements||[],targetAudience:t.targetAudience||[],categoryId:t.categoryId||""})}}}),{data:$}=(0,l.useQuery)(i.GET_COURSE_CATEGORIES),[D,{loading:L}]=(0,r.useMutation)(i.UPDATE_COURSE,{refetchQueries:[{query:i.GET_MY_COURSES}],onCompleted:()=>{e.push("/lms/instructor/dashboard")},onError:e=>{console.error("Error updating course:",e),T({submit:e.message})}}),A=$?.courseCategoryTree||[],S=e=>{let{name:t,value:s}=e.target;b(e=>({...e,[t]:"price"===t||"duration"===t?parseFloat(s)||0:s})),k[t]&&T(e=>({...e,[t]:""}))},M=()=>{y.trim()&&!x.tags.includes(y.trim())&&(b(e=>({...e,tags:[...e.tags,y.trim()]})),f(""))},R=async e=>{let t;if(e.preventDefault(),t={},(!x.title||x.title.length<3)&&(t.title="Tiêu đề phải có ít nhất 3 ký tự"),x.title.length>200&&(t.title="Tiêu đề không được quá 200 ký tự"),x.price<0&&(t.price="Giá không được âm"),x.duration&&x.duration<0&&(t.duration="Thời lượng không được âm"),T(t),0===Object.keys(t).length)try{let e={id:h,...x,duration:x.duration||void 0,metaTitle:x.metaTitle||void 0,metaDescription:x.metaDescription||void 0,categoryId:x.categoryId||void 0,thumbnail:x.thumbnail||void 0,trailer:x.trailer||void 0};await D({variables:{input:e}})}catch(e){console.error("Submit error:",e)}};return q?(0,t.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,t.jsxs)("div",{className:"text-center",children:[(0,t.jsx)(g.Loader2,{className:"w-12 h-12 animate-spin text-blue-600 mx-auto mb-4"}),(0,t.jsx)("p",{className:"text-gray-600",children:"Đang tải khóa học..."})]})}):(0,t.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,t.jsx)("div",{className:"bg-white border-b sticky top-0 z-10",children:(0,t.jsx)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{className:"flex items-center gap-4",children:[(0,t.jsx)(d.default,{href:"/lms/instructor/dashboard",className:"p-2 hover:bg-gray-100 rounded-lg transition-colors",children:(0,t.jsx)(o.ArrowLeft,{className:"w-5 h-5"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-2xl font-bold text-gray-900",children:"Chỉnh sửa khóa học"}),(0,t.jsx)("p",{className:"text-sm text-gray-600",children:E?.course?.title})]})]}),(0,t.jsxs)("button",{onClick:R,disabled:L,className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:[(0,t.jsx)(u.Save,{className:"w-5 h-5"}),L?"Đang lưu...":"Lưu thay đổi"]})]})})}),(0,t.jsxs)("div",{className:"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[k.submit&&(0,t.jsx)("div",{className:"mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700",children:k.submit}),(0,t.jsxs)("form",{onSubmit:R,className:"space-y-6",children:[(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100 p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"Thông tin cơ bản"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsxs)("label",{htmlFor:"title",className:"block text-sm font-medium text-gray-700 mb-2",children:["Tiêu đề khóa học ",(0,t.jsx)("span",{className:"text-red-500",children:"*"})]}),(0,t.jsx)("input",{type:"text",id:"title",name:"title",value:x.title,onChange:S,className:`w-full px-4 py-3 rounded-lg border ${k.title?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-blue-500"} focus:outline-none focus:ring-2`,placeholder:"Ví dụ: Lập trình Web với React & Next.js"}),k.title&&(0,t.jsx)("p",{className:"mt-1 text-sm text-red-600",children:k.title})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"description",className:"block text-sm font-medium text-gray-700 mb-2",children:"Mô tả khóa học"}),(0,t.jsx)("textarea",{id:"description",name:"description",value:x.description,onChange:S,rows:5,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Mô tả chi tiết về khóa học, nội dung, lợi ích học viên nhận được..."})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"categoryId",className:"block text-sm font-medium text-gray-700 mb-2",children:"Danh mục"}),(0,t.jsxs)("select",{id:"categoryId",name:"categoryId",value:x.categoryId,onChange:S,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,t.jsx)("option",{value:"",children:"-- Chọn danh mục --"}),A.map(e=>(0,t.jsxs)(s.default.Fragment,{children:[(0,t.jsx)("option",{value:e.id,children:e.name}),e.children?.map(e=>(0,t.jsxs)("option",{value:e.id,children:["  └─ ",e.name]},e.id))]},e.id))]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"level",className:"block text-sm font-medium text-gray-700 mb-2",children:"Cấp độ"}),(0,t.jsxs)("select",{id:"level",name:"level",value:x.level,onChange:S,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,t.jsx)("option",{value:"BEGINNER",children:"Cơ bản"}),(0,t.jsx)("option",{value:"INTERMEDIATE",children:"Trung cấp"}),(0,t.jsx)("option",{value:"ADVANCED",children:"Nâng cao"}),(0,t.jsx)("option",{value:"EXPERT",children:"Chuyên gia"})]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"price",className:"block text-sm font-medium text-gray-700 mb-2",children:"Giá (USD)"}),(0,t.jsx)("input",{type:"number",id:"price",name:"price",value:x.price,onChange:S,min:"0",step:"0.01",className:`w-full px-4 py-3 rounded-lg border ${k.price?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-blue-500"} focus:outline-none focus:ring-2`,placeholder:"0.00"}),k.price&&(0,t.jsx)("p",{className:"mt-1 text-sm text-red-600",children:k.price})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"duration",className:"block text-sm font-medium text-gray-700 mb-2",children:"Thời lượng (phút)"}),(0,t.jsx)("input",{type:"number",id:"duration",name:"duration",value:x.duration,onChange:S,min:"0",className:`w-full px-4 py-3 rounded-lg border ${k.duration?"border-red-300 focus:ring-red-500":"border-gray-300 focus:ring-blue-500"} focus:outline-none focus:ring-2`,placeholder:"0"}),k.duration&&(0,t.jsx)("p",{className:"mt-1 text-sm text-red-600",children:k.duration})]})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"status",className:"block text-sm font-medium text-gray-700 mb-2",children:"Trạng thái"}),(0,t.jsxs)("select",{id:"status",name:"status",value:x.status,onChange:S,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",children:[(0,t.jsx)("option",{value:"DRAFT",children:"Bản nháp"}),(0,t.jsx)("option",{value:"PUBLISHED",children:"Công khai"}),(0,t.jsx)("option",{value:"ARCHIVED",children:"Lưu trữ"})]})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100 p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"Nội dung & Yêu cầu"}),(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Bạn sẽ học được gì?"}),(0,t.jsxs)("div",{className:"flex gap-2 mb-3",children:[(0,t.jsx)("input",{type:"text",value:v,onChange:e=>j(e.target.value),onKeyPress:e=>{"Enter"===e.key&&(e.preventDefault(),v.trim()&&!x.whatYouWillLearn.includes(v.trim())&&(b(e=>({...e,whatYouWillLearn:[...e.whatYouWillLearn,v.trim()]})),j("")))},className:"flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Xây dựng ứng dụng web hoàn chỉnh..."}),(0,t.jsx)("button",{type:"button",onClick:()=>{v.trim()&&!x.whatYouWillLearn.includes(v.trim())&&(b(e=>({...e,whatYouWillLearn:[...e.whatYouWillLearn,v.trim()]})),j(""))},className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",children:"Thêm"})]}),(0,t.jsx)("div",{className:"space-y-2",children:x.whatYouWillLearn.map((e,s)=>(0,t.jsxs)("div",{className:"flex items-start gap-2 p-3 bg-gray-50 rounded-lg",children:[(0,t.jsx)("span",{className:"text-blue-600 mt-1",children:"✓"}),(0,t.jsx)("span",{className:"flex-1 text-gray-700",children:e}),(0,t.jsx)("button",{type:"button",onClick:()=>{b(e=>({...e,whatYouWillLearn:e.whatYouWillLearn.filter((e,t)=>t!==s)}))},className:"text-red-500 hover:text-red-700 p-1",children:(0,t.jsx)(m.X,{className:"w-4 h-4"})})]},s))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Yêu cầu"}),(0,t.jsxs)("div",{className:"flex gap-2 mb-3",children:[(0,t.jsx)("input",{type:"text",value:N,onChange:e=>C(e.target.value),onKeyPress:e=>{"Enter"===e.key&&(e.preventDefault(),N.trim()&&!x.requirements.includes(N.trim())&&(b(e=>({...e,requirements:[...e.requirements,N.trim()]})),C("")))},className:"flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Kiến thức cơ bản về HTML, CSS..."}),(0,t.jsx)("button",{type:"button",onClick:()=>{N.trim()&&!x.requirements.includes(N.trim())&&(b(e=>({...e,requirements:[...e.requirements,N.trim()]})),C(""))},className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",children:"Thêm"})]}),(0,t.jsx)("div",{className:"space-y-2",children:x.requirements.map((e,s)=>(0,t.jsxs)("div",{className:"flex items-start gap-2 p-3 bg-gray-50 rounded-lg",children:[(0,t.jsx)("span",{className:"text-gray-500 mt-1",children:"•"}),(0,t.jsx)("span",{className:"flex-1 text-gray-700",children:e}),(0,t.jsx)("button",{type:"button",onClick:()=>{b(e=>({...e,requirements:e.requirements.filter((e,t)=>t!==s)}))},className:"text-red-500 hover:text-red-700 p-1",children:(0,t.jsx)(m.X,{className:"w-4 h-4"})})]},s))})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Đối tượng học viên"}),(0,t.jsxs)("div",{className:"flex gap-2 mb-3",children:[(0,t.jsx)("input",{type:"text",value:w,onChange:e=>I(e.target.value),onKeyPress:e=>{"Enter"===e.key&&(e.preventDefault(),w.trim()&&!x.targetAudience.includes(w.trim())&&(b(e=>({...e,targetAudience:[...e.targetAudience,w.trim()]})),I("")))},className:"flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Người mới bắt đầu học lập trình web..."}),(0,t.jsx)("button",{type:"button",onClick:()=>{w.trim()&&!x.targetAudience.includes(w.trim())&&(b(e=>({...e,targetAudience:[...e.targetAudience,w.trim()]})),I(""))},className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",children:"Thêm"})]}),(0,t.jsx)("div",{className:"space-y-2",children:x.targetAudience.map((e,s)=>(0,t.jsxs)("div",{className:"flex items-start gap-2 p-3 bg-gray-50 rounded-lg",children:[(0,t.jsx)("span",{className:"text-purple-600 mt-1",children:"👤"}),(0,t.jsx)("span",{className:"flex-1 text-gray-700",children:e}),(0,t.jsx)("button",{type:"button",onClick:()=>{b(e=>({...e,targetAudience:e.targetAudience.filter((e,t)=>t!==s)}))},className:"text-red-500 hover:text-red-700 p-1",children:(0,t.jsx)(m.X,{className:"w-4 h-4"})})]},s))})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100 p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"Media"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"thumbnail",className:"block text-sm font-medium text-gray-700 mb-2",children:"Ảnh đại diện"}),(0,t.jsxs)("div",{className:"flex gap-4 items-start",children:[(0,t.jsx)("input",{type:"text",id:"thumbnail",name:"thumbnail",value:x.thumbnail,onChange:S,className:"flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://example.com/image.jpg"}),(0,t.jsxs)("button",{type:"button",className:"flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg",children:[(0,t.jsx)(c.Upload,{className:"w-5 h-5"}),"Upload"]})]}),x.thumbnail&&(0,t.jsx)("div",{className:"mt-3",children:(0,t.jsx)("img",{src:x.thumbnail,alt:"Preview",className:"w-full max-w-md h-48 object-cover rounded-lg"})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"trailer",className:"block text-sm font-medium text-gray-700 mb-2",children:"Video giới thiệu"}),(0,t.jsx)("input",{type:"text",id:"trailer",name:"trailer",value:x.trailer,onChange:S,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"https://youtube.com/watch?v=..."})]})]})]}),(0,t.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100 p-6",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-gray-900 mb-6",children:"SEO & Tags"}),(0,t.jsxs)("div",{className:"space-y-4",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"metaTitle",className:"block text-sm font-medium text-gray-700 mb-2",children:"Meta Title"}),(0,t.jsx)("input",{type:"text",id:"metaTitle",name:"metaTitle",value:x.metaTitle,onChange:S,maxLength:200,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"SEO title..."})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{htmlFor:"metaDescription",className:"block text-sm font-medium text-gray-700 mb-2",children:"Meta Description"}),(0,t.jsx)("textarea",{id:"metaDescription",name:"metaDescription",value:x.metaDescription,onChange:S,maxLength:500,rows:3,className:"w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"SEO description..."})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-2",children:"Tags"}),(0,t.jsxs)("div",{className:"flex gap-2 mb-3",children:[(0,t.jsx)("input",{type:"text",value:y,onChange:e=>f(e.target.value),onKeyPress:e=>"Enter"===e.key&&(e.preventDefault(),M()),className:"flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",placeholder:"Nhập tag và Enter..."}),(0,t.jsx)("button",{type:"button",onClick:M,className:"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg",children:"Thêm"})]}),(0,t.jsx)("div",{className:"flex flex-wrap gap-2",children:x.tags.map(e=>(0,t.jsxs)("span",{className:"inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm",children:[e,(0,t.jsx)("button",{type:"button",onClick:()=>{b(t=>({...t,tags:t.tags.filter(t=>t!==e)}))},className:"hover:bg-blue-200 rounded-full p-0.5",children:(0,t.jsx)(m.X,{className:"w-3 h-3"})})]},e))})]})]})]}),(0,t.jsx)("div",{className:"md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4",children:(0,t.jsxs)("button",{type:"submit",disabled:L,className:"w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium",children:[(0,t.jsx)(u.Save,{className:"w-5 h-5"}),L?"Đang lưu...":"Lưu thay đổi"]})})]}),(0,t.jsx)("div",{className:"md:hidden h-20"})]})]})}e.s(["default",()=>h])}]);