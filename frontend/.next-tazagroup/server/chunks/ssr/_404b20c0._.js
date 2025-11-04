module.exports=[939816,a=>{"use strict";let b=(0,a.i(367990).default)("plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);a.s(["default",()=>b])},723593,a=>{"use strict";var b=a.i(939816);a.s(["Plus",()=>b.default])},196915,a=>{"use strict";let b=(0,a.i(367990).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},855918,a=>{"use strict";let b=(0,a.i(367990).default)("square-pen",[["path",{d:"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",key:"1m0v6g"}],["path",{d:"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",key:"ohrbg2"}]]);a.s(["default",()=>b])},687649,a=>{"use strict";var b=a.i(855918);a.s(["Edit",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},462381,a=>{"use strict";let b=(0,a.i(367990).default)("dollar-sign",[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]]);a.s(["default",()=>b])},653107,a=>{"use strict";var b=a.i(462381);a.s(["DollarSign",()=>b.default])},198523,a=>{"use strict";let b=(0,a.i(367990).default)("list",[["path",{d:"M3 5h.01",key:"18ugdj"}],["path",{d:"M3 12h.01",key:"nlz23k"}],["path",{d:"M3 19h.01",key:"noohij"}],["path",{d:"M8 5h13",key:"1pao27"}],["path",{d:"M8 12h13",key:"1za7za"}],["path",{d:"M8 19h13",key:"m83p4d"}]]);a.s(["default",()=>b])},609153,a=>{"use strict";var b=a.i(198523);a.s(["List",()=>b.default])},208277,a=>{"use strict";let b=(0,a.i(367990).default)("archive",[["rect",{width:"20",height:"5",x:"2",y:"3",rx:"1",key:"1wp1u1"}],["path",{d:"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",key:"1s80jp"}],["path",{d:"M10 12h4",key:"a56b0p"}]]);a.s(["default",()=>b])},253322,a=>{"use strict";var b=a.i(208277);a.s(["Archive",()=>b.default])},852854,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`,d=b.gql`
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
  ${c}
`,e=b.gql`
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
  ${c}
`,f=b.gql`
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
  ${d}
`,g=b.gql`
  query GetMyCourses {
    myCourses {
      ...CourseBasic
      categoryId
    }
  }
  ${c}
`,h=b.gql`
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
`,i=b.gql`
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
`;b.gql`
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
`;let j=b.gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(createCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${d}
`,k=b.gql`
  mutation UpdateCourse($input: UpdateCourseInput!) {
    updateCourse(updateCourseInput: $input) {
      ...CourseDetail
    }
  }
  ${d}
`;b.gql`
  mutation PublishCourse($id: ID!) {
    publishCourse(id: $id) {
      id
      status
      publishedAt
    }
  }
`,b.gql`
  mutation DeleteCourse($id: ID!) {
    deleteCourse(id: $id)
  }
`,b.gql`
  mutation MarkLessonComplete($enrollmentId: ID!, $lessonId: ID!) {
    markLessonComplete(enrollmentId: $enrollmentId, lessonId: $lessonId) {
      id
      lessonId
      completed
      completedAt
    }
  }
`,b.gql`
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
`,b.gql`
  mutation UpdateModule($input: UpdateModuleInput!) {
    updateModule(input: $input) {
      id
      title
      description
      order
    }
  }
`,b.gql`
  mutation DeleteModule($id: ID!) {
    deleteModule(id: $id)
  }
`,b.gql`
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
`,b.gql`
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
`,b.gql`
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
`,b.gql`
  mutation DeleteLesson($id: ID!) {
    deleteLesson(id: $id)
  }
`,b.gql`
  mutation ReorderLessons($input: ReorderLessonsInput!) {
    reorderLessons(input: $input) {
      id
      title
      order
    }
  }
`,a.s(["CREATE_COURSE",0,j,"GET_COURSES",0,e,"GET_COURSE_BY_SLUG",0,f,"GET_COURSE_CATEGORIES",0,i,"GET_ENROLLMENT",0,h,"GET_MY_COURSES",0,g,"UPDATE_COURSE",0,k])},773404,a=>{"use strict";let b=(0,a.i(367990).default)("circle-play",[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},187145,a=>{"use strict";var b=a.i(773404);a.s(["PlayCircle",()=>b.default])},136468,a=>{"use strict";let b=(0,a.i(367990).default)("circle-question-mark",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",key:"1u773s"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);a.s(["default",()=>b])},445192,a=>{"use strict";var b=a.i(136468);a.s(["HelpCircle",()=>b.default])},720843,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(40947),f=a.i(53627),g=a.i(852854),h=a.i(439889),i=a.i(734639),j=a.i(26720),k=a.i(358054),l=a.i(653107),m=a.i(57597),n=a.i(687649),o=a.i(785903),p=a.i(253322),q=a.i(723593),r=a.i(891026),s=a.i(609153),t=a.i(187145),u=a.i(445192);function v(){let{user:a,loading:v}=(0,e.useAuth)(),w=(0,f.useRouter)();(0,c.useEffect)(()=>{v||a||w.push("/login?redirect=/lms/instructor/dashboard")},[a,v,w]);let{data:x,loading:y,error:z}=(0,d.useQuery)(g.GET_MY_COURSES,{skip:!a});if(v)return(0,b.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Đang kiểm tra đăng nhập..."})]})});if(!a)return null;if(y)return(0,b.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Đang tải khóa học của bạn..."})]})});if(z)return(0,b.jsx)("div",{className:"min-h-screen bg-gray-50 flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Truy cập bị từ chối"}),(0,b.jsx)("p",{className:"text-gray-600 mb-4",children:"Bạn cần vai trò ADMIN để truy cập trang này"}),(0,b.jsx)(h.default,{href:"/lms/courses",className:"inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:"Duyệt khóa học"})]})});let A=x?.myCourses||[],B={totalCourses:A.length,publishedCourses:A.filter(a=>"PUBLISHED"===a.status).length,totalStudents:A.reduce((a,b)=>a+b.enrollmentCount,0),totalRevenue:A.reduce((a,b)=>a+b.price*b.enrollmentCount,0)};return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-white border-b",children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold text-gray-900 mb-2",children:"Bảng điều khiển giảng viên"}),(0,b.jsx)("p",{className:"text-gray-600",children:"Quản lý khóa học và theo dõi hiệu suất"})]}),(0,b.jsxs)(h.default,{href:"/lms/instructor/courses/create",className:"flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:[(0,b.jsx)(q.Plus,{className:"w-5 h-5"}),"Tạo khóa học"]})]})})}),(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:[(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8",children:[(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("div",{className:"p-3 bg-blue-100 rounded-lg",children:(0,b.jsx)(j.BookOpen,{className:"w-6 h-6 text-blue-600"})}),(0,b.jsx)(m.TrendingUp,{className:"w-5 h-5 text-green-500"})]}),(0,b.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:B.totalCourses}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng số khóa học"}),(0,b.jsxs)("p",{className:"text-xs text-green-600 mt-2",children:[B.publishedCourses," đã xuất bản"]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("div",{className:"p-3 bg-green-100 rounded-lg",children:(0,b.jsx)(k.Users,{className:"w-6 h-6 text-green-600"})}),(0,b.jsx)(r.BarChart3,{className:"w-5 h-5 text-blue-500"})]}),(0,b.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:B.totalStudents}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng số học viên"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Trên tất cả khóa học"})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,b.jsx)("div",{className:"p-3 bg-yellow-100 rounded-lg",children:(0,b.jsx)(l.DollarSign,{className:"w-6 h-6 text-yellow-600"})}),(0,b.jsx)(m.TrendingUp,{className:"w-5 h-5 text-green-500"})]}),(0,b.jsxs)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:["$",B.totalRevenue.toFixed(2)]}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Tổng doanh thu"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Thu nhập toàn thời gian"})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm p-6 border border-gray-100",children:[(0,b.jsx)("div",{className:"flex items-center justify-between mb-4",children:(0,b.jsx)("div",{className:"p-3 bg-purple-100 rounded-lg",children:(0,b.jsx)(r.BarChart3,{className:"w-6 h-6 text-purple-600"})})}),(0,b.jsx)("h3",{className:"text-2xl font-bold text-gray-900 mb-1",children:B.totalStudents>0?(B.totalRevenue/B.totalStudents).toFixed(2):"0.00"}),(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"TB. Doanh thu/Học viên"}),(0,b.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"Mỗi lần ghi danh"})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-sm border border-gray-100",children:[(0,b.jsx)("div",{className:"px-6 py-4 border-b border-gray-100",children:(0,b.jsx)("h2",{className:"text-xl font-bold text-gray-900",children:"Khóa học của tôi"})}),0===A.length?(0,b.jsxs)("div",{className:"text-center py-16",children:[(0,b.jsx)(j.BookOpen,{className:"w-16 h-16 text-gray-300 mx-auto mb-4"}),(0,b.jsx)("h3",{className:"text-lg font-medium text-gray-900 mb-2",children:"Chưa có khóa học"}),(0,b.jsx)("p",{className:"text-gray-600 mb-6",children:"Bắt đầu tạo khóa học đầu tiên của bạn"}),(0,b.jsxs)(h.default,{href:"/lms/instructor/courses/create",className:"inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors",children:[(0,b.jsx)(q.Plus,{className:"w-5 h-5"}),"Tạo khóa học"]})]}):(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)("table",{className:"w-full",children:[(0,b.jsx)("thead",{className:"bg-gray-50",children:(0,b.jsxs)("tr",{children:[(0,b.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Khóa học"}),(0,b.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Trạng thái"}),(0,b.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Học viên"}),(0,b.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Doanh thu"}),(0,b.jsx)("th",{className:"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Đánh giá"}),(0,b.jsx)("th",{className:"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",children:"Hành động"})]})}),(0,b.jsx)("tbody",{className:"bg-white divide-y divide-gray-200",children:A.map(a=>(0,b.jsxs)("tr",{className:"hover:bg-gray-50",children:[(0,b.jsx)("td",{className:"px-6 py-4",children:(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[a.thumbnail?(0,b.jsx)(i.default,{src:a.thumbnail,alt:a.title,width:64,height:48,className:"rounded object-cover"}):(0,b.jsx)("div",{className:"w-16 h-12 bg-gray-200 rounded flex items-center justify-center",children:(0,b.jsx)(j.BookOpen,{className:"w-6 h-6 text-gray-400"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:a.title}),(0,b.jsx)("p",{className:"text-sm text-gray-500",children:a.level})]})]})}),(0,b.jsx)("td",{className:"px-6 py-4",children:(0,b.jsx)("span",{className:`px-2 py-1 text-xs font-medium rounded-full ${"PUBLISHED"===a.status?"bg-green-100 text-green-800":"DRAFT"===a.status?"bg-yellow-100 text-yellow-800":"bg-gray-100 text-gray-800"}`,children:"PUBLISHED"===a.status?"Đã xuất bản":"DRAFT"===a.status?"Bản nháp":a.status})}),(0,b.jsx)("td",{className:"px-6 py-4 text-sm text-gray-900",children:a.enrollmentCount}),(0,b.jsxs)("td",{className:"px-6 py-4 text-sm text-gray-900",children:["$",(a.price*a.enrollmentCount).toFixed(2)]}),(0,b.jsxs)("td",{className:"px-6 py-4 text-sm text-gray-900",children:["⭐ ",a.avgRating.toFixed(1)," (",a.reviewCount,")"]}),(0,b.jsx)("td",{className:"px-6 py-4 text-right text-sm font-medium",children:(0,b.jsxs)("div",{className:"flex items-center justify-end gap-2",children:[(0,b.jsx)(h.default,{href:`/lms/courses/${a.slug}`,className:"text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded transition-colors",title:"Xem",children:(0,b.jsx)(o.Eye,{className:"w-4 h-4"})}),(0,b.jsx)(h.default,{href:`/lms/instructor/courses/${a.id}/manage`,className:"text-purple-600 hover:text-purple-900 p-2 hover:bg-purple-50 rounded transition-colors",title:"Quản lý Module",children:(0,b.jsx)(s.List,{className:"w-4 h-4"})}),(0,b.jsx)(h.default,{href:`/lms/instructor/courses/${a.id}/lessons`,className:"text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded transition-colors",title:"Quản lý Bài học",children:(0,b.jsx)(t.PlayCircle,{className:"w-4 h-4"})}),(0,b.jsx)(h.default,{href:`/lms/instructor/courses/${a.id}/quizzes`,className:"text-amber-600 hover:text-amber-900 p-2 hover:bg-amber-50 rounded transition-colors",title:"Quản lý Quiz",children:(0,b.jsx)(u.HelpCircle,{className:"w-4 h-4"})}),(0,b.jsx)(h.default,{href:`/lms/instructor/courses/${a.id}/edit`,className:"text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded transition-colors",title:"Sửa",children:(0,b.jsx)(n.Edit,{className:"w-4 h-4"})}),(0,b.jsx)("button",{className:"text-orange-600 hover:text-orange-900 p-2 hover:bg-orange-50 rounded transition-colors",title:"Archive",children:(0,b.jsx)(p.Archive,{className:"w-4 h-4"})})]})})]},a.id))})]})})]})]})]})}a.s(["default",()=>v])}];

//# sourceMappingURL=_404b20c0._.js.map