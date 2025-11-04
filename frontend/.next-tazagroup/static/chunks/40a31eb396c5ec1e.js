(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,136582,e=>{"use strict";var s=e.i(44990),t=e.i(403055),a=e.i(429105),r=e.i(950988),l=e.i(492055),i=e.i(984804);let n=i.gql`
  fragment DiscussionReplyData on DiscussionReply {
    id
    content
    parentId
    createdAt
    updatedAt
    user {
      id
      username
      firstName
      lastName
      avatar
    }
  }
`,c=i.gql`
  fragment DiscussionData on Discussion {
    id
    title
    content
    isPinned
    createdAt
    updatedAt
    user {
      id
      username
      firstName
      lastName
      avatar
    }
    lesson {
      id
      title
    }
  }
`,d=i.gql`
  query GetCourseDiscussions($courseId: ID!, $lessonId: ID) {
    courseDiscussions(courseId: $courseId, lessonId: $lessonId) {
      ...DiscussionData
      replies {
        ...DiscussionReplyData
      }
    }
  }
  ${c}
  ${n}
`;i.gql`
  query GetDiscussion($id: ID!) {
    discussion(id: $id) {
      ...DiscussionData
      course {
        id
        title
        slug
      }
      replies {
        ...DiscussionReplyData
        children {
          ...DiscussionReplyData
        }
      }
    }
  }
  ${c}
  ${n}
`;let o=i.gql`
  mutation CreateDiscussion($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      ...DiscussionData
    }
  }
  ${c}
`,m=i.gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      ...DiscussionReplyData
    }
  }
  ${n}
`;i.gql`
  mutation UpdateDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input) {
      ...DiscussionData
    }
  }
  ${c}
`;let x=i.gql`
  mutation DeleteDiscussion($id: ID!) {
    deleteDiscussion(id: $id)
  }
`,u=i.gql`
  mutation ToggleDiscussionPin($id: ID!) {
    toggleDiscussionPin(id: $id) {
      ...DiscussionData
    }
  }
  ${c}
`;var h=e.i(130775),g=e.i(586754),p=e.i(777467),j=e.i(822390),f=e.i(169989),N=e.i(123959),v=e.i(885205);function w({courseId:e,courseSlug:a,isEnrolled:l=!1,price:i,onEnrollSuccess:n}){let c=(0,h.useRouter)(),{user:d,isAuthenticated:o}=(0,N.useAuth)(),[m,x]=(0,t.useState)(l);(0,t.useEffect)(()=>{x(l)},[l]);let[u,{loading:g}]=(0,r.useMutation)(p.ENROLL_COURSE,{onCompleted:()=>{x(!0),n&&n(),setTimeout(()=>{c.push(`/lms/learn/${a}`)},1e3)},onError:e=>{console.error("Enrollment error:",e),e.message.includes("Already enrolled")?(x(!0),c.push(`/lms/learn/${a}`)):alert(e.message||"Không thể ghi danh khóa học")}}),w=async()=>{if(!o||!d)return void c.push(`/login?returnUrl=/lms/courses/${a}`);try{await u({variables:{input:{courseId:e}}})}catch(e){}};return m?(0,s.jsxs)(v.Button,{onClick:()=>c.push(`/lms/learn/${a}`),className:"w-full bg-green-600 hover:bg-green-700",size:"lg",children:[(0,s.jsx)(j.CheckCircle,{className:"w-5 h-5 mr-2"}),"Vào học"]}):(0,s.jsx)(v.Button,{onClick:w,disabled:g,className:"w-full",size:"lg",children:g?(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(f.Loader2,{className:"w-5 h-5 mr-2 animate-spin"}),"Đang ghi danh..."]}):o?(0,s.jsx)(s.Fragment,{children:i>0?`Ghi danh - ${i.toLocaleString("vi-VN")}đ`:"Ghi danh miễn phí"}):(0,s.jsx)(s.Fragment,{children:"Đăng nhập để ghi danh"})})}var b=e.i(553579);let y={sm:"w-3 h-3",md:"w-4 h-4",lg:"w-5 h-5"};function C({rating:e,maxRating:t=5,size:a="md",showNumber:r=!1,reviewCount:l}){let i=[],n=Math.floor(e),c=e%1>=.5;for(let e=1;e<=t;e++)e<=n?i.push((0,s.jsx)(b.Star,{className:`${y[a]} text-yellow-400 fill-yellow-400`},e)):e===n+1&&c?i.push((0,s.jsxs)("div",{className:"relative",children:[(0,s.jsx)(b.Star,{className:`${y[a]} text-gray-300`}),(0,s.jsx)("div",{className:"absolute inset-0 overflow-hidden",style:{width:"50%"},children:(0,s.jsx)(b.Star,{className:`${y[a]} text-yellow-400 fill-yellow-400`})})]},e)):i.push((0,s.jsx)(b.Star,{className:`${y[a]} text-gray-300`},e));return(0,s.jsxs)("div",{className:"flex items-center gap-1",children:[(0,s.jsx)("div",{className:"flex items-center gap-0.5",children:i}),r&&(0,s.jsx)("span",{className:"text-sm font-medium text-gray-700 ml-1",children:e.toFixed(1)}),void 0!==l&&(0,s.jsxs)("span",{className:"text-sm text-gray-500 ml-1",children:["(",l,")"]})]})}var S=e.i(245421),D=e.i(495280),k=e.i(64886),$=e.i(775680),I=e.i(415733);let T=i.gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      courseId
      userId
      rating
      comment
      helpfulCount
      helpfulVoters
      createdAt
      updatedAt
      user {
        id
        username
        firstName
        lastName
        avatar
      }
    }
  }
`,A=i.gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
      rating
      comment
      updatedAt
    }
  }
`;i.gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`,i.gql`
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      id
      helpfulCount
      helpfulVoters
    }
  }
`,i.gql`
  query GetReviews($input: GetReviewsInput!) {
    reviews(input: $input) {
      reviews {
        id
        courseId
        userId
        rating
        comment
        helpfulCount
        helpfulVoters
        createdAt
        updatedAt
        user {
          id
          username
          firstName
          lastName
          avatar
        }
      }
      stats {
        avgRating
        totalReviews
        fiveStars
        fourStars
        threeStars
        twoStars
        oneStar
      }
      total
      page
      pageSize
    }
  }
`,i.gql`
  query GetReviewStats($courseId: ID!) {
    reviewStats(courseId: $courseId) {
      avgRating
      totalReviews
      fiveStars
      fourStars
      threeStars
      twoStars
      oneStar
    }
  }
`,i.gql`
  query GetUserReview($courseId: ID!) {
    userReview(courseId: $courseId) {
      id
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;var R=e.i(198513),B=e.i(165429);function q({courseId:e,existingReview:a,onSuccess:l,onCancel:i}){let[n,c]=(0,t.useState)(a?.rating||0),[d,o]=(0,t.useState)(0),[m,x]=(0,t.useState)(a?.comment||""),[u,h]=(0,t.useState)(""),[g,{loading:p}]=(0,r.useMutation)(T,{onCompleted:()=>{l?.()},onError:e=>{h(e.message||"Không thể tạo đánh giá")}}),[j,{loading:f}]=(0,r.useMutation)(A,{onCompleted:()=>{l?.()},onError:e=>{h(e.message||"Không thể cập nhật đánh giá")}}),N=p||f,w=async s=>{if(s.preventDefault(),h(""),0===n)return void h("Vui lòng chọn đánh giá sao");try{a?await j({variables:{input:{reviewId:a.id,rating:n,comment:m.trim()||void 0}}}):await g({variables:{input:{courseId:e,rating:n,comment:m.trim()||void 0}}})}catch(e){}};return(0,s.jsxs)("form",{onSubmit:w,className:"space-y-4 md:space-y-6",children:[(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsxs)(B.Label,{className:"text-sm md:text-base font-medium",children:["Đánh giá của bạn ",(0,s.jsx)("span",{className:"text-destructive",children:"*"})]}),(0,s.jsxs)("div",{className:"flex items-center gap-1 flex-wrap",children:[[1,2,3,4,5].map(e=>(0,s.jsx)("button",{type:"button",onClick:()=>c(e),onMouseEnter:()=>o(e),onMouseLeave:()=>o(0),className:"focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-transform hover:scale-110","aria-label":`Rate ${e} stars`,children:(0,s.jsx)(b.Star,{className:`w-6 h-6 md:w-8 md:h-8 transition-colors ${e<=(d||n)?"fill-yellow-400 text-yellow-400":"text-muted-foreground"}`})},e)),n>0&&(0,s.jsxs)("span",{className:"ml-2 md:ml-4 text-sm md:text-base font-medium text-foreground",children:[n," sao"]})]})]}),(0,s.jsxs)("div",{className:"space-y-2",children:[(0,s.jsxs)(B.Label,{htmlFor:"comment",className:"text-sm md:text-base font-medium",children:["Nhận xét của bạn ",(0,s.jsx)("span",{className:"text-muted-foreground",children:"(Tùy chọn)"})]}),(0,s.jsx)("textarea",{id:"comment",rows:4,value:m,onChange:e=>x(e.target.value),maxLength:1e3,placeholder:"Chia sẻ trải nghiệm của bạn về khóa học này...",className:"w-full px-3 md:px-4 py-2 md:py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none bg-background text-foreground text-sm md:text-base"}),(0,s.jsxs)("p",{className:"text-xs md:text-sm text-muted-foreground",children:[m.length," / 1000 ký tự"]})]}),u&&(0,s.jsxs)(I.Alert,{className:"border-destructive bg-destructive/10",children:[(0,s.jsx)(R.AlertCircle,{className:"h-4 w-4 text-destructive"}),(0,s.jsx)(I.AlertDescription,{className:"text-sm md:text-base text-destructive",children:u})]}),(0,s.jsxs)("div",{className:"flex flex-col-reverse sm:flex-row gap-2 md:gap-3",children:[(0,s.jsx)(v.Button,{type:"submit",disabled:N,className:"w-full sm:flex-1 md:text-base",children:N?"Đang gửi...":a?"Cập nhật đánh giá":"Gửi đánh giá"}),i&&(0,s.jsx)(v.Button,{type:"button",variant:"outline",onClick:i,disabled:N,className:"w-full sm:flex-1 md:text-base",children:"Hủy"})]})]})}var M=e.i(31545),M=M,E=e.i(965120),V=e.i(138227),G=e.i(975620),L=e.i(183194),U=e.i(702470);function z({courseId:e,currentUserId:a,onEditReview:r}){let[l,i]=(0,t.useState)("recent"),[n,c]=(0,t.useState)(null),[d,o]=(0,t.useState)(1),{data:m,loading:x,error:u,refetch:h}=(0,S.useFindMany)("review",{where:{courseId:e,...n&&{rating:n}},orderBy:"recent"===l?{createdAt:"desc"}:"helpful"===l?{helpfulCount:"desc"}:{rating:"desc"},skip:(d-1)*10,take:10}),[g]=(0,S.useUpdateOne)("review"),[p]=(0,S.useDeleteOne)("review"),j=async e=>{try{await g({where:{id:e},data:{helpfulCount:{increment:1}}}),h()}catch(e){console.error("Failed to mark review as helpful:",e)}},f=async e=>{if(confirm("Are you sure you want to delete this review?"))try{await p({where:{id:e}}),h()}catch(e){alert(e.message||"Failed to delete review")}};if(x&&!m)return(0,s.jsx)("div",{className:"space-y-3 md:space-y-4",children:[1,2,3].map(e=>(0,s.jsx)($.Card,{children:(0,s.jsx)($.CardContent,{className:"pt-6",children:(0,s.jsxs)("div",{className:"space-y-3 animate-pulse",children:[(0,s.jsx)("div",{className:"h-4 bg-muted rounded w-1/4"}),(0,s.jsx)("div",{className:"h-20 bg-muted rounded"})]})})},e))});if(u)return(0,s.jsxs)(I.Alert,{className:"border-destructive bg-destructive/10",children:[(0,s.jsx)(R.AlertCircle,{className:"h-4 w-4 text-destructive"}),(0,s.jsxs)(I.AlertDescription,{className:"text-destructive",children:["Không thể tải đánh giá: ",u.message]})]});let N=m||[],w=N?.length||0;return(0,s.jsxs)("div",{className:"space-y-4 md:space-y-6",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4",children:[(0,s.jsx)("div",{children:n&&(0,s.jsxs)(U.Badge,{variant:"outline",className:"cursor-pointer hover:bg-muted text-xs md:text-sm",onClick:()=>c(null),children:[n," sao ×"]})}),(0,s.jsxs)(L.Select,{value:l,onValueChange:e=>i(e),children:[(0,s.jsx)(L.SelectTrigger,{className:"w-full sm:w-auto md:text-base",children:(0,s.jsx)(L.SelectValue,{})}),(0,s.jsxs)(L.SelectContent,{children:[(0,s.jsx)(L.SelectItem,{value:"recent",children:"Mới nhất"}),(0,s.jsx)(L.SelectItem,{value:"helpful",children:"Hữu ích nhất"}),(0,s.jsx)(L.SelectItem,{value:"rating",children:"Đánh giá cao nhất"})]})]})]}),0===N.length?(0,s.jsx)($.Card,{children:(0,s.jsx)($.CardContent,{className:"pt-12 pb-12 text-center",children:(0,s.jsx)("p",{className:"text-muted-foreground text-sm md:text-base",children:n?`Chưa c\xf3 đ\xe1nh gi\xe1 ${n} sao`:"Chưa có đánh giá nào. Hãy là người đầu tiên viết đánh giá!"})})}):(0,s.jsx)("div",{className:"space-y-3 md:space-y-4",children:N.map(e=>{let t,l=a===e.userId,i=a&&e.helpfulVoters?.includes(a);return(0,s.jsx)($.Card,{className:"hover:shadow-md transition-shadow",children:(0,s.jsxs)($.CardContent,{className:"pt-4 md:pt-6",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4",children:[(0,s.jsxs)("div",{className:"flex items-start gap-3",children:[(0,s.jsx)("div",{className:"w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0",children:e.user?.firstName?.[0]||e.user?.username?.[0]||"U"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("div",{className:"font-medium text-foreground text-sm md:text-base",children:e.user?.firstName&&e.user?.lastName?`${e.user.firstName} ${e.user.lastName}`:e.user?.username||"Ẩn danh"}),(0,s.jsxs)("div",{className:"flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-1",children:[(0,s.jsx)("div",{className:"flex items-center gap-1",children:(t=e.rating,(0,s.jsx)("div",{className:"flex items-center gap-1",children:[1,2,3,4,5].map(e=>(0,s.jsx)(b.Star,{className:`w-4 h-4 ${e<=t?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},e))}))}),(0,s.jsx)("span",{className:"text-xs md:text-sm text-muted-foreground",children:(0,G.formatDistanceToNow)(new Date(e.createdAt),{addSuffix:!0,locale:{formatDistance:()=>"Gần đây"}})})]})]})]}),l&&(0,s.jsxs)("div",{className:"flex gap-1",children:[(0,s.jsx)(v.Button,{variant:"ghost",size:"sm",onClick:()=>r?.(e),className:"h-8 w-8 p-0",title:"Chỉnh sửa đánh giá",children:(0,s.jsx)(E.Edit,{className:"w-4 h-4"})}),(0,s.jsx)(v.Button,{variant:"ghost",size:"sm",onClick:()=>f(e.id),className:"h-8 w-8 p-0 text-destructive hover:text-destructive",title:"Xóa đánh giá",children:(0,s.jsx)(V.Trash2,{className:"w-4 h-4"})})]})]}),e.comment&&(0,s.jsx)("p",{className:"text-foreground text-sm md:text-base mb-4 whitespace-pre-wrap break-words",children:e.comment}),a&&!l&&(0,s.jsxs)(v.Button,{variant:i?"default":"outline",size:"sm",onClick:()=>j(e.id),className:"w-full xs:w-auto gap-2 text-xs md:text-sm",children:[(0,s.jsx)(M.default,{className:`w-3 h-3 md:w-4 md:h-4 ${i?"fill-current":""}`}),"Hữu ích (",e.helpfulCount||0,")"]})]})},e.id)})}),w>10&&(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 flex-wrap",children:[(0,s.jsx)(v.Button,{variant:"outline",size:"sm",onClick:()=>o(e=>Math.max(1,e-1)),disabled:1===d,className:"w-full xs:w-auto",children:"Trước"}),(0,s.jsxs)("span",{className:"text-xs md:text-sm text-muted-foreground",children:["Trang ",d," / ",Math.ceil(w/10)]}),(0,s.jsx)(v.Button,{variant:"outline",size:"sm",onClick:()=>o(e=>e+1),disabled:d>=Math.ceil(w/10),className:"w-full xs:w-auto",children:"Sau"})]})]})}function H({courseId:e,currentUserId:a,isEnrolled:r}){let[l,i]=(0,t.useState)(!1),[n,c]=(0,t.useState)(null),{data:d,refetch:o}=(0,S.useFindMany)("review",{where:{courseId:e,...a&&{userId:a}},take:1}),m=d?.[0];return(0,s.jsxs)("div",{className:"space-y-6 md:space-y-8",children:[(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 md:gap-3",children:[(0,s.jsx)(D.MessageSquare,{className:"w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0"}),(0,s.jsx)("h2",{className:"text-xl md:text-2xl font-bold text-foreground",children:"Đánh giá từ học viên"})]}),r&&a&&(0,s.jsx)("div",{children:m&&!l?(0,s.jsxs)(v.Button,{onClick:()=>{c(m),i(!0)},size:"sm",className:"w-full sm:w-auto gap-2",children:[(0,s.jsx)(k.Edit2,{className:"w-4 h-4"}),(0,s.jsx)("span",{className:"hidden xs:inline",children:"Chỉnh sửa đánh giá"}),(0,s.jsx)("span",{className:"xs:hidden",children:"Chỉnh sửa"})]}):m||l?null:(0,s.jsx)(v.Button,{onClick:()=>i(!0),size:"sm",className:"w-full sm:w-auto",children:"Viết đánh giá"})})]}),!r&&a&&(0,s.jsx)(I.Alert,{className:"border-blue-200 bg-blue-50",children:(0,s.jsxs)(I.AlertDescription,{className:"text-sm text-blue-800",children:[(0,s.jsx)("strong",{className:"block sm:inline",children:"Ghi danh khóa học này"}),(0,s.jsx)("span",{className:"block sm:inline sm:before:content-[' '] md:before:content-[' ']",children:"để viết đánh giá và chia sẻ trải nghiệm của bạn với các học viên khác."})]})}),l&&r&&a&&(0,s.jsx)($.Card,{className:"border-2 border-primary/20",children:(0,s.jsxs)($.CardContent,{className:"pt-6",children:[(0,s.jsx)("h3",{className:"text-base md:text-lg font-semibold text-foreground mb-4",children:n?"Chỉnh sửa đánh giá của bạn":"Viết đánh giá của bạn"}),(0,s.jsx)(q,{courseId:e,existingReview:n,onSuccess:()=>{i(!1),c(null),o()},onCancel:()=>{i(!1),c(null)}})]})}),(0,s.jsx)(z,{courseId:e,currentUserId:a,onEditReview:e=>{c(e),i(!0)}})]})}var O=e.i(36455),P=e.i(799777),F=e.i(519536),K=e.i(784386),Y=e.i(766981);function _({discussion:e,refetch:a,canModerate:l,isOwner:i}){let[n,c]=(0,t.useState)(""),[d,o]=(0,t.useState)(!0),[h,g]=(0,t.useState)(null),[p]=(0,r.useMutation)(m),[j]=(0,r.useMutation)(x),[f]=(0,r.useMutation)(u),N=async()=>{if(n.trim())try{await p({variables:{input:{discussionId:e.id,content:n,parentId:h}}}),c(""),g(null),a()}catch(e){console.error("Error creating reply:",e)}},v=async()=>{if(confirm("Bạn có chắc chắn muốn xóa thảo luận này?"))try{await j({variables:{id:e.id}}),a()}catch(e){console.error("Error deleting discussion:",e)}},w=async()=>{try{await f({variables:{id:e.id}}),a()}catch(e){console.error("Error toggling pin:",e)}},b=e=>e.firstName&&e.lastName?`${e.firstName} ${e.lastName}`:e.username;return(0,s.jsxs)("div",{className:"bg-white rounded-xl shadow-md p-6 mb-4 border border-gray-100",children:[(0,s.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,s.jsxs)("div",{className:"flex gap-3 flex-1",children:[(0,s.jsx)("img",{src:e.user.avatar||"/default-avatar.png",alt:e.user.username,className:"w-12 h-12 rounded-full object-cover"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsxs)("div",{className:"flex items-center gap-2 flex-wrap",children:[(0,s.jsx)("h3",{className:"font-bold text-lg text-gray-900",children:e.title}),e.isPinned&&(0,s.jsxs)("span",{className:"flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full",children:[(0,s.jsx)(P.Pin,{className:"w-3 h-3"}),"Đã ghim"]})]}),(0,s.jsxs)("p",{className:"text-sm text-gray-600",children:["by ",b(e.user)," • ",new Date(e.createdAt).toLocaleDateString("vi-VN")]})]})]}),(0,s.jsxs)("div",{className:"flex gap-2",children:[l&&(0,s.jsx)("button",{onClick:w,className:"p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",title:e.isPinned?"Bỏ ghim":"Ghim",children:(0,s.jsx)(P.Pin,{className:"w-5 h-5"})}),(l||i)&&(0,s.jsx)("button",{onClick:v,className:"p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors",title:"Xóa",children:(0,s.jsx)(V.Trash2,{className:"w-5 h-5"})})]})]}),(0,s.jsx)("div",{className:"prose max-w-none mb-4 pl-15",children:(0,s.jsx)("p",{className:"text-gray-700 whitespace-pre-wrap",children:e.content})}),(0,s.jsxs)("div",{className:"border-t border-gray-200 pt-4 mt-4",children:[(0,s.jsxs)("button",{onClick:()=>o(!d),className:"flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-3",children:[(0,s.jsx)(O.MessageCircle,{className:"w-4 h-4"}),e.replies.length," ",(e.replies.length,"phản hồi"),d?(0,s.jsx)(Y.ChevronUp,{className:"w-4 h-4"}):(0,s.jsx)(K.ChevronDown,{className:"w-4 h-4"})]}),d&&(0,s.jsxs)(s.Fragment,{children:[e.replies.length>0&&(0,s.jsx)("div",{className:"space-y-3 mb-4",children:e.replies.map(e=>(0,s.jsxs)("div",{className:"flex gap-3 pl-4 border-l-2 border-gray-200",children:[(0,s.jsx)("img",{src:e.user.avatar||"/default-avatar.png",alt:e.user.username,className:"w-8 h-8 rounded-full object-cover"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsxs)("div",{className:"bg-gray-50 rounded-lg p-3",children:[(0,s.jsx)("p",{className:"text-sm font-medium text-gray-900 mb-1",children:b(e.user)}),(0,s.jsx)("p",{className:"text-sm text-gray-700 whitespace-pre-wrap",children:e.content})]}),(0,s.jsxs)("div",{className:"flex items-center gap-3 mt-1 text-xs text-gray-500",children:[(0,s.jsx)("span",{children:new Date(e.createdAt).toLocaleDateString("vi-VN")}),(0,s.jsxs)("button",{onClick:()=>g(e.id),className:"flex items-center gap-1 hover:text-blue-600",children:[(0,s.jsx)(F.Reply,{className:"w-3 h-3"}),"Reply"]})]}),e.children?.length>0&&(0,s.jsx)("div",{className:"mt-3 space-y-2 pl-4 border-l-2 border-gray-100",children:e.children.map(e=>(0,s.jsxs)("div",{className:"flex gap-2",children:[(0,s.jsx)("img",{src:e.user.avatar||"/default-avatar.png",alt:e.user.username,className:"w-6 h-6 rounded-full object-cover"}),(0,s.jsxs)("div",{className:"flex-1 bg-gray-50 rounded-lg p-2",children:[(0,s.jsx)("p",{className:"text-xs font-medium text-gray-900 mb-1",children:b(e.user)}),(0,s.jsx)("p",{className:"text-xs text-gray-700",children:e.content})]})]},e.id))})]})]},e.id))}),(0,s.jsxs)("div",{className:"flex gap-3",children:[(0,s.jsx)("textarea",{value:n,onChange:e=>c(e.target.value),placeholder:h?"Viết phản hồi...":"Viết bình luận...",className:"flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",rows:3}),(0,s.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,s.jsx)("button",{onClick:N,disabled:!n.trim(),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium",children:"Phản hồi"}),h&&(0,s.jsx)("button",{onClick:()=>g(null),className:"px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm",children:"Hủy"})]})]})]})]})]})}var Q=e.i(415588),W=e.i(771564),X=e.i(608631),J=e.i(564216),Z=e.i(865706),ee=e.i(224949),es=e.i(421329),et=e.i(606443),ea=e.i(996517),er=e.i(67087),el=e.i(774309),ei=e.i(41714),en=e.i(368670),ec=e.i(696134),ed=e.i(600547);function eo(){let e=(0,h.useParams)(),i=e?.slug,{user:n,isAuthenticated:c}=(0,N.useAuth)(),[m,x]=(0,t.useState)("overview"),[u,p]=(0,t.useState)(!1),[f,b]=(0,t.useState)(""),[y,S]=(0,t.useState)(""),{data:k,loading:T,error:A}=(0,a.useQuery)(l.GET_COURSE_BY_SLUG,{variables:{slug:i},skip:!i}),{data:R,refetch:B}=(0,a.useQuery)(l.GET_ENROLLMENT,{variables:{courseId:k?.courseBySlug?.id||""},skip:!k?.courseBySlug?.id||!c});(0,t.useEffect)(()=>{c&&k?.courseBySlug?.id&&B()},[c,k?.courseBySlug?.id,B]);let{data:q,refetch:M}=(0,a.useQuery)(d,{variables:{courseId:k?.courseBySlug?.id},skip:!k?.courseBySlug?.id||"discussions"!==m}),[E]=(0,r.useMutation)(o,{onCompleted:()=>{p(!1),b(""),S(""),M()}});if(T)return(0,s.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,s.jsx)("div",{className:"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",children:(0,s.jsxs)("div",{className:"container mx-auto px-4 py-8 md:py-16",children:[(0,s.jsx)(el.Skeleton,{className:"h-10 w-3/4 mb-4 bg-primary-foreground/20"}),(0,s.jsx)(el.Skeleton,{className:"h-6 w-1/2 bg-primary-foreground/20"})]})}),(0,s.jsx)("div",{className:"container mx-auto px-4 py-6",children:(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,s.jsx)("div",{className:"lg:col-span-2 space-y-4",children:(0,s.jsx)(el.Skeleton,{className:"h-[400px] w-full"})}),(0,s.jsx)("div",{className:"lg:col-span-1",children:(0,s.jsx)(el.Skeleton,{className:"h-[500px] w-full"})})]})})]});if(A||!k?.courseBySlug)return(0,s.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center p-4",children:(0,s.jsx)($.Card,{className:"max-w-md w-full",children:(0,s.jsxs)($.CardHeader,{children:[(0,s.jsx)($.CardTitle,{children:"Không tìm thấy khóa học"}),(0,s.jsx)($.CardDescription,{children:"Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."})]})})});let V=k.courseBySlug,G=V.modules?.reduce((e,s)=>e+(s.lessons?.length||0),0)||0,L=async e=>{if(e.preventDefault(),f.trim()&&y.trim())try{await E({variables:{input:{courseId:V.id,title:f,content:y}}})}catch(e){console.error("Error creating discussion:",e)}};return(0,s.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,s.jsx)("div",{className:"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",children:(0,s.jsx)("div",{className:"container mx-auto px-4 py-8 md:py-12 lg:py-16",children:(0,s.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8",children:[(0,s.jsxs)("div",{className:"lg:col-span-2 space-y-4 md:space-y-6",children:[V.category&&(0,s.jsx)(U.Badge,{variant:"secondary",className:"mb-2",children:V.category.name}),(0,s.jsx)("h1",{className:"text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",children:V.title}),(0,s.jsx)("p",{className:"text-lg md:text-xl text-primary-foreground/90",children:V.description}),(0,s.jsxs)("div",{className:"flex flex-wrap items-center gap-4 md:gap-6",children:[(0,s.jsx)(C,{rating:V.avgRating,size:"lg",showNumber:!0,reviewCount:V.reviewCount}),(0,s.jsxs)("div",{className:"flex items-center gap-2",children:[(0,s.jsx)(W.Users,{className:"w-4 h-4 md:w-5 md:h-5"}),(0,s.jsxs)("span",{className:"text-sm md:text-base",children:[V.enrollmentCount," học viên"]})]})]}),V.instructor&&(0,s.jsxs)("div",{className:"flex items-center gap-3 pt-2",children:[(0,s.jsxs)(ei.Avatar,{className:"w-10 h-10 md:w-12 md:h-12",children:[(0,s.jsx)(ei.AvatarImage,{src:V.instructor.avatar||"",alt:V.instructor.username}),(0,s.jsx)(ei.AvatarFallback,{children:V.instructor.firstName?.[0]||V.instructor.username[0]})]}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs md:text-sm text-primary-foreground/70",children:"Tạo bởi"}),(0,s.jsx)("p",{className:"font-medium text-sm md:text-base",children:V.instructor.firstName&&V.instructor.lastName?`${V.instructor.firstName} ${V.instructor.lastName}`:V.instructor.username})]})]}),(0,s.jsx)("div",{className:"bg-white rounded-lg container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 lg:pb-12",children:(0,s.jsxs)(ea.Tabs,{defaultValue:"overview",className:"w-full",children:[(0,s.jsxs)(ea.TabsList,{className:"w-full justify-start overflow-x-auto flex-nowrap h-auto p-1",children:[(0,s.jsx)(ea.TabsTrigger,{value:"overview",className:"text-xs md:text-sm",children:"Tổng quan"}),(0,s.jsxs)(ea.TabsTrigger,{value:"content",className:"text-xs md:text-sm",children:[(0,s.jsx)(X.BookOpen,{className:"w-4 h-4 mr-1.5"}),"Nội dung"]}),(0,s.jsx)(ea.TabsTrigger,{value:"reviews",className:"text-xs md:text-sm",children:"Đánh giá"}),(0,s.jsxs)(ea.TabsTrigger,{value:"discussions",className:"text-xs md:text-sm",children:[(0,s.jsx)(D.MessageSquare,{className:"w-4 h-4 mr-1.5"}),"Thảo luận"]})]}),(0,s.jsxs)(ea.TabsContent,{value:"overview",className:"mt-6 space-y-6",children:[(0,s.jsxs)($.Card,{className:"lg:hidden",children:[(0,s.jsx)($.CardHeader,{children:(0,s.jsx)($.CardTitle,{className:"text-lg",children:"Thông tin khóa học"})}),(0,s.jsx)($.CardContent,{className:"space-y-4",children:(0,s.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,s.jsxs)("div",{className:"flex items-start gap-2",children:[(0,s.jsx)(Z.Award,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Cấp độ"}),(0,s.jsx)("p",{className:"text-sm font-medium",children:V.level})]})]}),V.duration&&(0,s.jsxs)("div",{className:"flex items-start gap-2",children:[(0,s.jsx)(Q.Clock,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Thời lượng"}),(0,s.jsxs)("p",{className:"text-sm font-medium",children:[Math.floor(V.duration/60),"h ",V.duration%60,"m"]})]})]}),(0,s.jsxs)("div",{className:"flex items-start gap-2",children:[(0,s.jsx)(X.BookOpen,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Bài học"}),(0,s.jsxs)("p",{className:"text-sm font-medium",children:[G," bài học"]})]})]}),(0,s.jsxs)("div",{className:"flex items-start gap-2",children:[(0,s.jsx)(J.Globe,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ngôn ngữ"}),(0,s.jsx)("p",{className:"text-sm font-medium",children:"Tiếng Việt"})]})]})]})})]}),V.whatYouWillLearn&&V.whatYouWillLearn.length>0&&(0,s.jsxs)($.Card,{children:[(0,s.jsx)($.CardHeader,{children:(0,s.jsx)($.CardTitle,{children:"Bạn sẽ học được gì"})}),(0,s.jsx)($.CardContent,{children:(0,s.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4",children:V.whatYouWillLearn.map((e,t)=>(0,s.jsxs)("div",{className:"flex items-start gap-2 md:gap-3",children:[(0,s.jsx)(j.CheckCircle,{className:"w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5"}),(0,s.jsx)("span",{className:"text-sm md:text-base",children:e})]},t))})})]}),V.requirements&&V.requirements.length>0&&(0,s.jsxs)($.Card,{children:[(0,s.jsx)($.CardHeader,{children:(0,s.jsx)($.CardTitle,{children:"Yêu cầu"})}),(0,s.jsx)($.CardContent,{children:(0,s.jsx)("ul",{className:"space-y-2",children:V.requirements.map((e,t)=>(0,s.jsxs)("li",{className:"flex items-start gap-2 md:gap-3 text-sm md:text-base",children:[(0,s.jsx)("span",{className:"text-muted-foreground",children:"•"}),e]},t))})})]})]}),(0,s.jsx)(ea.TabsContent,{value:"content",className:"mt-6",children:(0,s.jsxs)($.Card,{children:[(0,s.jsxs)($.CardHeader,{children:[(0,s.jsx)($.CardTitle,{children:"Nội dung khóa học"}),(0,s.jsxs)($.CardDescription,{children:[V.modules?.length||0," chương • ",G," bài học"]})]}),(0,s.jsx)($.CardContent,{children:V.modules&&V.modules.length>0?(0,s.jsx)(en.Accordion,{type:"single",collapsible:!0,defaultValue:"item-0",className:"w-full",children:V.modules.map((e,t)=>(0,s.jsxs)(en.AccordionItem,{value:`item-${t}`,children:[(0,s.jsx)(en.AccordionTrigger,{className:"hover:no-underline",children:(0,s.jsxs)("div",{className:"flex items-center justify-between w-full pr-4 text-left",children:[(0,s.jsxs)("span",{className:"font-semibold text-sm md:text-base",children:[t+1,". ",e.title]}),(0,s.jsxs)(U.Badge,{variant:"secondary",className:"text-xs",children:[e.lessons?.length||0," bài"]})]})}),(0,s.jsx)(en.AccordionContent,{children:(0,s.jsx)("div",{className:"space-y-1 pt-2",children:e.lessons?.map((e,a)=>(0,s.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-accent rounded-lg transition-colors",children:["VIDEO"===e.type?(0,s.jsx)(ee.PlayCircle,{className:"w-4 h-4 text-muted-foreground flex-shrink-0"}):(0,s.jsx)(es.FileText,{className:"w-4 h-4 text-muted-foreground flex-shrink-0"}),(0,s.jsxs)("span",{className:"text-sm md:text-base flex-1",children:[t+1,".",a+1," ",e.title]}),e.duration&&(0,s.jsxs)("span",{className:"text-xs md:text-sm text-muted-foreground",children:[e.duration," phút"]})]},e.id))})})]},e.id))}):(0,s.jsx)(I.Alert,{children:(0,s.jsx)(I.AlertDescription,{children:"Chưa có nội dung khóa học."})})})]})}),(0,s.jsx)(ea.TabsContent,{value:"reviews",className:"mt-6",children:(0,s.jsx)($.Card,{children:(0,s.jsx)($.CardContent,{className:"p-4 md:p-6",children:(0,s.jsx)(H,{courseId:V.id,currentUserId:n?.id,isEnrolled:!!R?.enrollment})})})}),(0,s.jsx)(ea.TabsContent,{value:"discussions",className:"mt-6",children:(0,s.jsx)($.Card,{children:(0,s.jsxs)($.CardContent,{className:"p-4 md:p-6 space-y-6",children:[R?.enrollment&&!u&&(0,s.jsxs)(v.Button,{onClick:()=>p(!0),className:"w-full",size:"lg",children:[(0,s.jsx)(et.Plus,{className:"w-5 h-5 mr-2"}),"Bắt đầu thảo luận mới"]}),u&&(0,s.jsxs)($.Card,{className:"border-2",children:[(0,s.jsx)($.CardHeader,{children:(0,s.jsx)($.CardTitle,{className:"text-lg",children:"Thảo luận mới"})}),(0,s.jsx)($.CardContent,{children:(0,s.jsxs)("form",{onSubmit:L,className:"space-y-4",children:[(0,s.jsx)("div",{children:(0,s.jsx)(ec.Input,{type:"text",value:f,onChange:e=>b(e.target.value),placeholder:"Tiêu đề thảo luận...",required:!0})}),(0,s.jsx)("div",{children:(0,s.jsx)(ed.Textarea,{value:y,onChange:e=>S(e.target.value),placeholder:"Bạn muốn thảo luận điều gì?",rows:4,required:!0})}),(0,s.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3",children:[(0,s.jsx)(v.Button,{type:"submit",className:"flex-1 sm:flex-none",children:"Đăng thảo luận"}),(0,s.jsx)(v.Button,{type:"button",variant:"outline",onClick:()=>{p(!1),b(""),S("")},className:"flex-1 sm:flex-none",children:"Hủy"})]})]})})]}),R?.enrollment?q?.courseDiscussions&&q.courseDiscussions.length>0?(0,s.jsx)("div",{className:"space-y-4",children:q.courseDiscussions.map(e=>(0,s.jsx)(_,{discussion:e,refetch:M,canModerate:V.instructor?.id===n?.id,isOwner:e.user.id===n?.id},e.id))}):(0,s.jsxs)(I.Alert,{children:[(0,s.jsx)(D.MessageSquare,{className:"w-4 h-4"}),(0,s.jsx)(I.AlertDescription,{children:"Chưa có thảo luận nào. Hãy là người đầu tiên bắt đầu!"})]}):(0,s.jsxs)(I.Alert,{children:[(0,s.jsx)(D.MessageSquare,{className:"w-4 h-4"}),(0,s.jsx)(I.AlertDescription,{children:"Ghi danh khóa học này để tham gia thảo luận"})]})]})})})]})})]}),(0,s.jsx)("div",{className:"hidden lg:block",children:(0,s.jsx)($.Card,{className:"sticky top-4 shadow-lg",children:(0,s.jsxs)($.CardContent,{className:"p-6 space-y-6",children:[V.thumbnail&&(0,s.jsx)("div",{className:"relative h-48 rounded-lg overflow-hidden",children:(0,s.jsx)(g.default,{src:V.thumbnail,alt:V.title,fill:!0,className:"object-cover"})}),(0,s.jsx)("div",{className:"text-3xl font-bold",children:V.price>0?`${V.price.toLocaleString("vi-VN")}đ`:"Miễn phí"}),(0,s.jsx)(w,{courseId:V.id,courseSlug:V.slug,price:V.price,isEnrolled:!!R?.enrollment}),(0,s.jsx)(er.Separator,{}),(0,s.jsxs)("div",{className:"space-y-4",children:[(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)(Z.Award,{className:"w-5 h-5 text-muted-foreground"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Cấp độ"}),(0,s.jsx)("p",{className:"font-medium",children:V.level})]})]}),V.duration&&(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)(Q.Clock,{className:"w-5 h-5 text-muted-foreground"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Thời lượng"}),(0,s.jsxs)("p",{className:"font-medium",children:[Math.floor(V.duration/60),"h ",V.duration%60,"m"]})]})]}),(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)(X.BookOpen,{className:"w-5 h-5 text-muted-foreground"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Bài học"}),(0,s.jsxs)("p",{className:"font-medium",children:[G," bài học"]})]})]}),(0,s.jsxs)("div",{className:"flex items-center gap-3",children:[(0,s.jsx)(J.Globe,{className:"w-5 h-5 text-muted-foreground"}),(0,s.jsxs)("div",{className:"flex-1",children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ngôn ngữ"}),(0,s.jsx)("p",{className:"font-medium",children:"Tiếng Việt"})]})]})]})]})})})]})})}),(0,s.jsx)("div",{className:"lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50",children:(0,s.jsxs)("div",{className:"container mx-auto px-4 py-3 flex items-center justify-between gap-4",children:[(0,s.jsxs)("div",{children:[(0,s.jsx)("p",{className:"text-xs text-muted-foreground",children:"Giá khóa học"}),(0,s.jsx)("p",{className:"text-xl font-bold",children:V.price>0?`${V.price.toLocaleString("vi-VN")}đ`:"Miễn phí"})]}),(0,s.jsx)(w,{courseId:V.id,courseSlug:V.slug,price:V.price,isEnrolled:!!R?.enrollment})]})})]})}e.s(["default",()=>eo],136582)}]);