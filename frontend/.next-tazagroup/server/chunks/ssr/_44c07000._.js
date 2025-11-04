module.exports=[57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},975780,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(422171);let e=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("rounded-lg border bg-card text-card-foreground shadow-sm",a),...c}));e.displayName="Card";let f=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex flex-col space-y-1.5 p-6",a),...c}));f.displayName="CardHeader";let g=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("h3",{ref:e,className:(0,d.cn)("text-2xl font-semibold leading-none tracking-tight",a),...c}));g.displayName="CardTitle";let h=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("p",{ref:e,className:(0,d.cn)("text-sm text-muted-foreground",a),...c}));h.displayName="CardDescription";let i=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("p-6 pt-0",a),...c}));i.displayName="CardContent";let j=c.forwardRef(({className:a,...c},e)=>(0,b.jsx)("div",{ref:e,className:(0,d.cn)("flex items-center p-6 pt-0",a),...c}));j.displayName="CardFooter",a.s(["Card",()=>e,"CardContent",()=>i,"CardDescription",()=>h,"CardFooter",()=>j,"CardHeader",()=>f,"CardTitle",()=>g])},293470,a=>{"use strict";var b=a.i(321248),c=a.i(13801),d=a.i(422171);let e=(0,c.cva)("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",{variants:{variant:{default:"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",secondary:"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",destructive:"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",outline:"text-foreground",warning:"border-transparent bg-yellow-500 text-white hover:bg-yellow-600"}},defaultVariants:{variant:"default"}});function f({className:a,variant:c,...f}){return(0,b.jsx)("span",{className:(0,d.cn)(e({variant:c}),a),...f})}a.s(["Badge",()=>f])},605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},733554,925556,a=>{"use strict";let b=(0,a.i(367990).default)("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);a.s(["default",()=>b],925556),a.s(["Loader2",()=>b],733554)},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},419822,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  fragment EnrollmentData on Enrollment {
    id
    userId
    courseId
    status
    progress
    enrolledAt
    completedAt
    lastAccessedAt
  }
`,d=b.gql`
  query GetMyEnrollments {
    myEnrollments {
      ...EnrollmentData
      course {
        id
        title
        slug
        thumbnail
        level
        duration
        categoryId
        instructor {
          id
          username
          firstName
          lastName
          avatar
        }
      }
    }
  }
  ${c}
`;b.gql`
  query GetEnrollment($courseId: ID!) {
    enrollment(courseId: $courseId) {
      ...EnrollmentData
      course {
        id
        title
        slug
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
            videoUrl
            content
          }
        }
      }
      lessonProgress {
        id
        lessonId
        completed
        watchedDuration
        lastWatchedAt
        score
      }
    }
  }
  ${c}
`,b.gql`
  query GetCourseEnrollments($courseId: ID!) {
    courseEnrollments(courseId: $courseId) {
      ...EnrollmentData
      user {
        id
        username
        email
        firstName
        lastName
        avatar
      }
    }
  }
  ${c}
`;let e=b.gql`
  mutation EnrollCourse($input: EnrollCourseInput!) {
    enrollCourse(enrollCourseInput: $input) {
      ...EnrollmentData
      course {
        id
        title
        slug
      }
    }
  }
  ${c}
`;b.gql`
  mutation DropCourse($courseId: ID!) {
    dropCourse(courseId: $courseId) {
      ...EnrollmentData
    }
  }
  ${c}
`,a.s(["ENROLL_COURSE",0,e,"GET_MY_ENROLLMENTS",0,d])},37613,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(40947),f=a.i(53627),g=a.i(419822),h=a.i(734639),i=a.i(439889);let j={sm:"h-1",md:"h-2",lg:"h-3"},k={blue:"bg-blue-600",green:"bg-green-600",purple:"bg-purple-600",yellow:"bg-yellow-600"};function l({progress:a,size:c="md",showPercentage:d=!1,color:e="blue"}){let f=Math.min(Math.max(a,0),100);return(0,b.jsxs)("div",{className:"w-full",children:[(0,b.jsx)("div",{className:`w-full bg-gray-200 rounded-full overflow-hidden ${j[c]}`,children:(0,b.jsx)("div",{className:`${j[c]} ${k[e]} transition-all duration-300 ease-out rounded-full`,style:{width:`${f}%`}})}),d&&(0,b.jsxs)("p",{className:"text-sm text-gray-600 mt-1 text-right",children:[f,"%"]})]})}var m=a.i(26720),n=a.i(411185),o=a.i(57597),p=a.i(147678),q=a.i(733554),r=a.i(975780),s=a.i(202979),t=a.i(293470);function u(){let{user:a,loading:j}=(0,e.useAuth)(),k=(0,f.useRouter)(),[u,v]=(0,c.useState)("ALL");(0,c.useEffect)(()=>{j||a||k.push("/login?redirect=/lms/my-learning")},[a,j,k]);let{data:w,loading:x,error:y}=(0,d.useQuery)(g.GET_MY_ENROLLMENTS,{skip:!a});if(j)return(0,b.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,b.jsx)(r.Card,{className:"w-full max-w-md",children:(0,b.jsxs)(r.CardContent,{className:"pt-6 text-center",children:[(0,b.jsx)(q.Loader2,{className:"w-12 h-12 animate-spin text-primary mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Đang kiểm tra đăng nhập..."})]})})});if(!a)return null;if(x)return(0,b.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,b.jsx)(r.Card,{className:"w-full max-w-md",children:(0,b.jsxs)(r.CardContent,{className:"pt-6 text-center",children:[(0,b.jsx)(q.Loader2,{className:"w-12 h-12 animate-spin text-primary mx-auto mb-4"}),(0,b.jsx)("p",{className:"text-muted-foreground",children:"Đang tải khóa học của bạn..."})]})})});if(y)return(0,b.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center",children:(0,b.jsxs)(r.Card,{className:"w-full max-w-md border-destructive",children:[(0,b.jsx)(r.CardHeader,{children:(0,b.jsx)(r.CardTitle,{className:"text-destructive",children:"Lỗi khi tải khóa học"})}),(0,b.jsx)(r.CardContent,{children:(0,b.jsx)("p",{className:"text-muted-foreground",children:"Vui lòng thử lại sau"})})]})});let z=w?.myEnrollments||[],A=z.filter(a=>"COMPLETED"===u?"COMPLETED"===a.status:"IN_PROGRESS"!==u||"ACTIVE"===a.status&&a.progress>0),B={total:z.length,inProgress:z.filter(a=>"ACTIVE"===a.status&&a.progress>0).length,completed:z.filter(a=>"COMPLETED"===a.status).length,averageProgress:z.length>0?z.reduce((a,b)=>a+b.progress,0)/z.length:0};return(0,b.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,b.jsx)("div",{className:"border-b bg-card",children:(0,b.jsxs)("div",{className:"container mx-auto px-4 py-6 md:py-8",children:[(0,b.jsx)("h1",{className:"text-2xl md:text-3xl font-bold mb-6",children:"Học tập của tôi"}),(0,b.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8",children:[(0,b.jsx)(r.Card,{className:"bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200",children:(0,b.jsxs)(r.CardContent,{className:"p-4 md:p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 mb-2",children:[(0,b.jsx)(m.BookOpen,{className:"w-5 h-5 md:w-6 md:h-6 text-blue-600"}),(0,b.jsx)("h3",{className:"text-xs md:text-sm font-medium text-blue-900 dark:text-blue-100",children:"Tổng khóa học"})]}),(0,b.jsx)("p",{className:"text-2xl md:text-3xl font-bold text-blue-900 dark:text-blue-100",children:B.total})]})}),(0,b.jsx)(r.Card,{className:"bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200",children:(0,b.jsxs)(r.CardContent,{className:"p-4 md:p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 mb-2",children:[(0,b.jsx)(o.TrendingUp,{className:"w-5 h-5 md:w-6 md:h-6 text-yellow-600"}),(0,b.jsx)("h3",{className:"text-xs md:text-sm font-medium text-yellow-900 dark:text-yellow-100",children:"Đang học"})]}),(0,b.jsx)("p",{className:"text-2xl md:text-3xl font-bold text-yellow-900 dark:text-yellow-100",children:B.inProgress})]})}),(0,b.jsx)(r.Card,{className:"bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200",children:(0,b.jsxs)(r.CardContent,{className:"p-4 md:p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 mb-2",children:[(0,b.jsx)(p.Award,{className:"w-5 h-5 md:w-6 md:h-6 text-green-600"}),(0,b.jsx)("h3",{className:"text-xs md:text-sm font-medium text-green-900 dark:text-green-100",children:"Hoàn thành"})]}),(0,b.jsx)("p",{className:"text-2xl md:text-3xl font-bold text-green-900 dark:text-green-100",children:B.completed})]})}),(0,b.jsx)(r.Card,{className:"bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200",children:(0,b.jsxs)(r.CardContent,{className:"p-4 md:p-6",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 mb-2",children:[(0,b.jsx)(n.Clock,{className:"w-5 h-5 md:w-6 md:h-6 text-purple-600"}),(0,b.jsx)("h3",{className:"text-xs md:text-sm font-medium text-purple-900 dark:text-purple-100",children:"Tiến độ TB"})]}),(0,b.jsxs)("p",{className:"text-2xl md:text-3xl font-bold text-purple-900 dark:text-purple-100",children:[B.averageProgress.toFixed(0),"%"]})]})})]}),(0,b.jsxs)("div",{className:"flex gap-2 overflow-x-auto pb-2",children:[(0,b.jsxs)(s.Button,{onClick:()=>v("ALL"),variant:"ALL"===u?"default":"outline",size:"sm",children:["Tất cả (",z.length,")"]}),(0,b.jsxs)(s.Button,{onClick:()=>v("IN_PROGRESS"),variant:"IN_PROGRESS"===u?"default":"outline",size:"sm",children:["Đang học (",B.inProgress,")"]}),(0,b.jsxs)(s.Button,{onClick:()=>v("COMPLETED"),variant:"COMPLETED"===u?"default":"outline",size:"sm",children:["Hoàn thành (",B.completed,")"]})]})]})}),(0,b.jsx)("div",{className:"container mx-auto px-4 py-6 md:py-8",children:0===A.length?(0,b.jsx)(r.Card,{className:"max-w-2xl mx-auto",children:(0,b.jsxs)(r.CardContent,{className:"pt-16 pb-16 text-center",children:[(0,b.jsx)(m.BookOpen,{className:"w-16 h-16 text-muted-foreground mx-auto mb-4"}),(0,b.jsx)("h3",{className:"text-lg font-medium mb-2",children:"ALL"===u?"Chưa có khóa học nào":"COMPLETED"===u?"Chưa có khóa học hoàn thành":"Chưa có khóa học đang học"}),(0,b.jsx)("p",{className:"text-muted-foreground mb-6",children:"Bắt đầu học bằng cách ghi danh khóa học"}),(0,b.jsx)(s.Button,{asChild:!0,size:"lg",children:(0,b.jsx)(i.default,{href:"/lms/courses",children:"Duyệt khóa học"})})]})}):(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6",children:A.map(a=>(0,b.jsx)(i.default,{href:`/lms/courses/${a.course.slug}`,children:(0,b.jsxs)(r.Card,{className:"overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full",children:[(0,b.jsx)("div",{className:"relative h-48 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden",children:a.course.thumbnail?(0,b.jsx)(h.default,{src:a.course.thumbnail,alt:a.course.title,fill:!0,className:"object-cover group-hover:scale-105 transition-transform duration-300"}):(0,b.jsx)("div",{className:"w-full h-full flex items-center justify-center",children:(0,b.jsx)(m.BookOpen,{className:"w-16 h-16 text-blue-300"})})}),(0,b.jsxs)(r.CardContent,{className:"p-4 md:p-5",children:[(0,b.jsx)("h3",{className:"text-base md:text-lg font-bold mb-3 line-clamp-2 hover:text-primary transition-colors",children:a.course.title}),(0,b.jsxs)("div",{className:"mb-4",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between mb-2",children:[(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"Tiến độ"}),(0,b.jsxs)("span",{className:"text-sm font-medium",children:[a.progress,"%"]})]}),(0,b.jsx)(l,{progress:a.progress,size:"md",color:"COMPLETED"===a.status?"green":"blue"})]}),"COMPLETED"===a.status&&(0,b.jsxs)(t.Badge,{className:"bg-green-600 hover:bg-green-700",children:[(0,b.jsx)(p.Award,{className:"w-3 h-3 mr-1"}),"Hoàn thành"]}),a.completedAt&&(0,b.jsxs)("p",{className:"text-xs text-muted-foreground mt-2",children:["Hoàn thành vào ",new Date(a.completedAt).toLocaleDateString("vi-VN")]})]})]})},a.id))})})]})}a.s(["default",()=>u],37613)}];

//# sourceMappingURL=_44c07000._.js.map