module.exports=[756883,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(8912),f=a.i(852854),g=a.i(772213);let h=g.gql`
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
`,i=g.gql`
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
`,j=g.gql`
  query GetCourseDiscussions($courseId: ID!, $lessonId: ID) {
    courseDiscussions(courseId: $courseId, lessonId: $lessonId) {
      ...DiscussionData
      replies {
        ...DiscussionReplyData
      }
    }
  }
  ${i}
  ${h}
`;g.gql`
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
  ${i}
  ${h}
`;let k=g.gql`
  mutation CreateDiscussion($input: CreateDiscussionInput!) {
    createDiscussion(input: $input) {
      ...DiscussionData
    }
  }
  ${i}
`,l=g.gql`
  mutation CreateReply($input: CreateReplyInput!) {
    createReply(input: $input) {
      ...DiscussionReplyData
    }
  }
  ${h}
`;g.gql`
  mutation UpdateDiscussion($input: UpdateDiscussionInput!) {
    updateDiscussion(input: $input) {
      ...DiscussionData
    }
  }
  ${i}
`;let m=g.gql`
  mutation DeleteDiscussion($id: ID!) {
    deleteDiscussion(id: $id)
  }
`,n=g.gql`
  mutation ToggleDiscussionPin($id: ID!) {
    toggleDiscussionPin(id: $id) {
      ...DiscussionData
    }
  }
  ${i}
`;var o=a.i(53627),p=a.i(734639),q=a.i(419822),r=a.i(508335),s=a.i(733554),t=a.i(40947),u=a.i(202979);function v({courseId:a,courseSlug:d,isEnrolled:f=!1,price:g,onEnrollSuccess:h}){let i=(0,o.useRouter)(),{user:j,isAuthenticated:k}=(0,t.useAuth)(),[l,m]=(0,c.useState)(f);(0,c.useEffect)(()=>{m(f)},[f]);let[n,{loading:p}]=(0,e.useMutation)(q.ENROLL_COURSE,{onCompleted:()=>{m(!0),h&&h(),setTimeout(()=>{i.push(`/lms/learn/${d}`)},1e3)},onError:a=>{console.error("Enrollment error:",a),a.message.includes("Already enrolled")?(m(!0),i.push(`/lms/learn/${d}`)):alert(a.message||"Không thể ghi danh khóa học")}}),v=async()=>{if(!k||!j)return void i.push(`/login?returnUrl=/lms/courses/${d}`);try{await n({variables:{input:{courseId:a}}})}catch(a){}};return l?(0,b.jsxs)(u.Button,{onClick:()=>i.push(`/lms/learn/${d}`),className:"w-full bg-green-600 hover:bg-green-700",size:"lg",children:[(0,b.jsx)(r.CheckCircle,{className:"w-5 h-5 mr-2"}),"Vào học"]}):(0,b.jsx)(u.Button,{onClick:v,disabled:p,className:"w-full",size:"lg",children:p?(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(s.Loader2,{className:"w-5 h-5 mr-2 animate-spin"}),"Đang ghi danh..."]}):k?(0,b.jsx)(b.Fragment,{children:g>0?`Ghi danh - ${g.toLocaleString("vi-VN")}đ`:"Ghi danh miễn phí"}):(0,b.jsx)(b.Fragment,{children:"Đăng nhập để ghi danh"})})}var w=a.i(520215);let x={sm:"w-3 h-3",md:"w-4 h-4",lg:"w-5 h-5"};function y({rating:a,maxRating:c=5,size:d="md",showNumber:e=!1,reviewCount:f}){let g=[],h=Math.floor(a),i=a%1>=.5;for(let a=1;a<=c;a++)a<=h?g.push((0,b.jsx)(w.Star,{className:`${x[d]} text-yellow-400 fill-yellow-400`},a)):a===h+1&&i?g.push((0,b.jsxs)("div",{className:"relative",children:[(0,b.jsx)(w.Star,{className:`${x[d]} text-gray-300`}),(0,b.jsx)("div",{className:"absolute inset-0 overflow-hidden",style:{width:"50%"},children:(0,b.jsx)(w.Star,{className:`${x[d]} text-yellow-400 fill-yellow-400`})})]},a)):g.push((0,b.jsx)(w.Star,{className:`${x[d]} text-gray-300`},a));return(0,b.jsxs)("div",{className:"flex items-center gap-1",children:[(0,b.jsx)("div",{className:"flex items-center gap-0.5",children:g}),e&&(0,b.jsx)("span",{className:"text-sm font-medium text-gray-700 ml-1",children:a.toFixed(1)}),void 0!==f&&(0,b.jsxs)("span",{className:"text-sm text-gray-500 ml-1",children:["(",f,")"]})]})}var z=a.i(235746),A=a.i(638735),B=a.i(107723),C=a.i(975780),D=a.i(359379);let E=g.gql`
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
`,F=g.gql`
  mutation UpdateReview($input: UpdateReviewInput!) {
    updateReview(input: $input) {
      id
      rating
      comment
      updatedAt
    }
  }
`;g.gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`,g.gql`
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      id
      helpfulCount
      helpfulVoters
    }
  }
`,g.gql`
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
`,g.gql`
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
`,g.gql`
  query GetUserReview($courseId: ID!) {
    userReview(courseId: $courseId) {
      id
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;var G=a.i(327987),H=a.i(441405);function I({courseId:a,existingReview:d,onSuccess:f,onCancel:g}){let[h,i]=(0,c.useState)(d?.rating||0),[j,k]=(0,c.useState)(0),[l,m]=(0,c.useState)(d?.comment||""),[n,o]=(0,c.useState)(""),[p,{loading:q}]=(0,e.useMutation)(E,{onCompleted:()=>{f?.()},onError:a=>{o(a.message||"Không thể tạo đánh giá")}}),[r,{loading:s}]=(0,e.useMutation)(F,{onCompleted:()=>{f?.()},onError:a=>{o(a.message||"Không thể cập nhật đánh giá")}}),t=q||s,v=async b=>{if(b.preventDefault(),o(""),0===h)return void o("Vui lòng chọn đánh giá sao");try{d?await r({variables:{input:{reviewId:d.id,rating:h,comment:l.trim()||void 0}}}):await p({variables:{input:{courseId:a,rating:h,comment:l.trim()||void 0}}})}catch(a){}};return(0,b.jsxs)("form",{onSubmit:v,className:"space-y-4 md:space-y-6",children:[(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)(H.Label,{className:"text-sm md:text-base font-medium",children:["Đánh giá của bạn ",(0,b.jsx)("span",{className:"text-destructive",children:"*"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-1 flex-wrap",children:[[1,2,3,4,5].map(a=>(0,b.jsx)("button",{type:"button",onClick:()=>i(a),onMouseEnter:()=>k(a),onMouseLeave:()=>k(0),className:"focus:outline-none focus:ring-2 focus:ring-primary rounded-sm transition-transform hover:scale-110","aria-label":`Rate ${a} stars`,children:(0,b.jsx)(w.Star,{className:`w-6 h-6 md:w-8 md:h-8 transition-colors ${a<=(j||h)?"fill-yellow-400 text-yellow-400":"text-muted-foreground"}`})},a)),h>0&&(0,b.jsxs)("span",{className:"ml-2 md:ml-4 text-sm md:text-base font-medium text-foreground",children:[h," sao"]})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)(H.Label,{htmlFor:"comment",className:"text-sm md:text-base font-medium",children:["Nhận xét của bạn ",(0,b.jsx)("span",{className:"text-muted-foreground",children:"(Tùy chọn)"})]}),(0,b.jsx)("textarea",{id:"comment",rows:4,value:l,onChange:a=>m(a.target.value),maxLength:1e3,placeholder:"Chia sẻ trải nghiệm của bạn về khóa học này...",className:"w-full px-3 md:px-4 py-2 md:py-3 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 resize-none bg-background text-foreground text-sm md:text-base"}),(0,b.jsxs)("p",{className:"text-xs md:text-sm text-muted-foreground",children:[l.length," / 1000 ký tự"]})]}),n&&(0,b.jsxs)(D.Alert,{className:"border-destructive bg-destructive/10",children:[(0,b.jsx)(G.AlertCircle,{className:"h-4 w-4 text-destructive"}),(0,b.jsx)(D.AlertDescription,{className:"text-sm md:text-base text-destructive",children:n})]}),(0,b.jsxs)("div",{className:"flex flex-col-reverse sm:flex-row gap-2 md:gap-3",children:[(0,b.jsx)(u.Button,{type:"submit",disabled:t,className:"w-full sm:flex-1 md:text-base",children:t?"Đang gửi...":d?"Cập nhật đánh giá":"Gửi đánh giá"}),g&&(0,b.jsx)(u.Button,{type:"button",variant:"outline",onClick:g,disabled:t,className:"w-full sm:flex-1 md:text-base",children:"Hủy"})]})]})}var J=a.i(139925),J=J,K=a.i(687649),L=a.i(558767),M=a.i(509423),N=a.i(144932),O=a.i(293470);function P({courseId:a,currentUserId:d,onEditReview:e}){let[f,g]=(0,c.useState)("recent"),[h,i]=(0,c.useState)(null),[j,k]=(0,c.useState)(1),{data:l,loading:m,error:n,refetch:o}=(0,z.useFindMany)("review",{where:{courseId:a,...h&&{rating:h}},orderBy:"recent"===f?{createdAt:"desc"}:"helpful"===f?{helpfulCount:"desc"}:{rating:"desc"},skip:(j-1)*10,take:10}),[p]=(0,z.useUpdateOne)("review"),[q]=(0,z.useDeleteOne)("review"),r=async a=>{try{await p({where:{id:a},data:{helpfulCount:{increment:1}}}),o()}catch(a){console.error("Failed to mark review as helpful:",a)}},s=async a=>{if(confirm("Are you sure you want to delete this review?"))try{await q({where:{id:a}}),o()}catch(a){alert(a.message||"Failed to delete review")}};if(m&&!l)return(0,b.jsx)("div",{className:"space-y-3 md:space-y-4",children:[1,2,3].map(a=>(0,b.jsx)(C.Card,{children:(0,b.jsx)(C.CardContent,{className:"pt-6",children:(0,b.jsxs)("div",{className:"space-y-3 animate-pulse",children:[(0,b.jsx)("div",{className:"h-4 bg-muted rounded w-1/4"}),(0,b.jsx)("div",{className:"h-20 bg-muted rounded"})]})})},a))});if(n)return(0,b.jsxs)(D.Alert,{className:"border-destructive bg-destructive/10",children:[(0,b.jsx)(G.AlertCircle,{className:"h-4 w-4 text-destructive"}),(0,b.jsxs)(D.AlertDescription,{className:"text-destructive",children:["Không thể tải đánh giá: ",n.message]})]});let t=l||[],v=t?.length||0;return(0,b.jsxs)("div",{className:"space-y-4 md:space-y-6",children:[(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4",children:[(0,b.jsx)("div",{children:h&&(0,b.jsxs)(O.Badge,{variant:"outline",className:"cursor-pointer hover:bg-muted text-xs md:text-sm",onClick:()=>i(null),children:[h," sao ×"]})}),(0,b.jsxs)(N.Select,{value:f,onValueChange:a=>g(a),children:[(0,b.jsx)(N.SelectTrigger,{className:"w-full sm:w-auto md:text-base",children:(0,b.jsx)(N.SelectValue,{})}),(0,b.jsxs)(N.SelectContent,{children:[(0,b.jsx)(N.SelectItem,{value:"recent",children:"Mới nhất"}),(0,b.jsx)(N.SelectItem,{value:"helpful",children:"Hữu ích nhất"}),(0,b.jsx)(N.SelectItem,{value:"rating",children:"Đánh giá cao nhất"})]})]})]}),0===t.length?(0,b.jsx)(C.Card,{children:(0,b.jsx)(C.CardContent,{className:"pt-12 pb-12 text-center",children:(0,b.jsx)("p",{className:"text-muted-foreground text-sm md:text-base",children:h?`Chưa c\xf3 đ\xe1nh gi\xe1 ${h} sao`:"Chưa có đánh giá nào. Hãy là người đầu tiên viết đánh giá!"})})}):(0,b.jsx)("div",{className:"space-y-3 md:space-y-4",children:t.map(a=>{let c,f=d===a.userId,g=d&&a.helpfulVoters?.includes(d);return(0,b.jsx)(C.Card,{className:"hover:shadow-md transition-shadow",children:(0,b.jsxs)(C.CardContent,{className:"pt-4 md:pt-6",children:[(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4",children:[(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0",children:a.user?.firstName?.[0]||a.user?.username?.[0]||"U"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("div",{className:"font-medium text-foreground text-sm md:text-base",children:a.user?.firstName&&a.user?.lastName?`${a.user.firstName} ${a.user.lastName}`:a.user?.username||"Ẩn danh"}),(0,b.jsxs)("div",{className:"flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mt-1",children:[(0,b.jsx)("div",{className:"flex items-center gap-1",children:(c=a.rating,(0,b.jsx)("div",{className:"flex items-center gap-1",children:[1,2,3,4,5].map(a=>(0,b.jsx)(w.Star,{className:`w-4 h-4 ${a<=c?"fill-yellow-400 text-yellow-400":"text-gray-300"}`},a))}))}),(0,b.jsx)("span",{className:"text-xs md:text-sm text-muted-foreground",children:(0,M.formatDistanceToNow)(new Date(a.createdAt),{addSuffix:!0,locale:{formatDistance:()=>"Gần đây"}})})]})]})]}),f&&(0,b.jsxs)("div",{className:"flex gap-1",children:[(0,b.jsx)(u.Button,{variant:"ghost",size:"sm",onClick:()=>e?.(a),className:"h-8 w-8 p-0",title:"Chỉnh sửa đánh giá",children:(0,b.jsx)(K.Edit,{className:"w-4 h-4"})}),(0,b.jsx)(u.Button,{variant:"ghost",size:"sm",onClick:()=>s(a.id),className:"h-8 w-8 p-0 text-destructive hover:text-destructive",title:"Xóa đánh giá",children:(0,b.jsx)(L.Trash2,{className:"w-4 h-4"})})]})]}),a.comment&&(0,b.jsx)("p",{className:"text-foreground text-sm md:text-base mb-4 whitespace-pre-wrap break-words",children:a.comment}),d&&!f&&(0,b.jsxs)(u.Button,{variant:g?"default":"outline",size:"sm",onClick:()=>r(a.id),className:"w-full xs:w-auto gap-2 text-xs md:text-sm",children:[(0,b.jsx)(J.default,{className:`w-3 h-3 md:w-4 md:h-4 ${g?"fill-current":""}`}),"Hữu ích (",a.helpfulCount||0,")"]})]})},a.id)})}),v>10&&(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3 flex-wrap",children:[(0,b.jsx)(u.Button,{variant:"outline",size:"sm",onClick:()=>k(a=>Math.max(1,a-1)),disabled:1===j,className:"w-full xs:w-auto",children:"Trước"}),(0,b.jsxs)("span",{className:"text-xs md:text-sm text-muted-foreground",children:["Trang ",j," / ",Math.ceil(v/10)]}),(0,b.jsx)(u.Button,{variant:"outline",size:"sm",onClick:()=>k(a=>a+1),disabled:j>=Math.ceil(v/10),className:"w-full xs:w-auto",children:"Sau"})]})]})}function Q({courseId:a,currentUserId:d,isEnrolled:e}){let[f,g]=(0,c.useState)(!1),[h,i]=(0,c.useState)(null),{data:j,refetch:k}=(0,z.useFindMany)("review",{where:{courseId:a,...d&&{userId:d}},take:1}),l=j?.[0];return(0,b.jsxs)("div",{className:"space-y-6 md:space-y-8",children:[(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3",children:[(0,b.jsx)(A.MessageSquare,{className:"w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0"}),(0,b.jsx)("h2",{className:"text-xl md:text-2xl font-bold text-foreground",children:"Đánh giá từ học viên"})]}),e&&d&&(0,b.jsx)("div",{children:l&&!f?(0,b.jsxs)(u.Button,{onClick:()=>{i(l),g(!0)},size:"sm",className:"w-full sm:w-auto gap-2",children:[(0,b.jsx)(B.Edit2,{className:"w-4 h-4"}),(0,b.jsx)("span",{className:"hidden xs:inline",children:"Chỉnh sửa đánh giá"}),(0,b.jsx)("span",{className:"xs:hidden",children:"Chỉnh sửa"})]}):l||f?null:(0,b.jsx)(u.Button,{onClick:()=>g(!0),size:"sm",className:"w-full sm:w-auto",children:"Viết đánh giá"})})]}),!e&&d&&(0,b.jsx)(D.Alert,{className:"border-blue-200 bg-blue-50",children:(0,b.jsxs)(D.AlertDescription,{className:"text-sm text-blue-800",children:[(0,b.jsx)("strong",{className:"block sm:inline",children:"Ghi danh khóa học này"}),(0,b.jsx)("span",{className:"block sm:inline sm:before:content-[' '] md:before:content-[' ']",children:"để viết đánh giá và chia sẻ trải nghiệm của bạn với các học viên khác."})]})}),f&&e&&d&&(0,b.jsx)(C.Card,{className:"border-2 border-primary/20",children:(0,b.jsxs)(C.CardContent,{className:"pt-6",children:[(0,b.jsx)("h3",{className:"text-base md:text-lg font-semibold text-foreground mb-4",children:h?"Chỉnh sửa đánh giá của bạn":"Viết đánh giá của bạn"}),(0,b.jsx)(I,{courseId:a,existingReview:h,onSuccess:()=>{g(!1),i(null),k()},onCancel:()=>{g(!1),i(null)}})]})}),(0,b.jsx)(P,{courseId:a,currentUserId:d,onEditReview:a=>{i(a),g(!0)}})]})}var R=a.i(646254),S=a.i(841230),T=a.i(810687),U=a.i(669055),V=a.i(616191);function W({discussion:a,refetch:d,canModerate:f,isOwner:g}){let[h,i]=(0,c.useState)(""),[j,k]=(0,c.useState)(!0),[o,p]=(0,c.useState)(null),[q]=(0,e.useMutation)(l),[r]=(0,e.useMutation)(m),[s]=(0,e.useMutation)(n),t=async()=>{if(h.trim())try{await q({variables:{input:{discussionId:a.id,content:h,parentId:o}}}),i(""),p(null),d()}catch(a){console.error("Error creating reply:",a)}},u=async()=>{if(confirm("Bạn có chắc chắn muốn xóa thảo luận này?"))try{await r({variables:{id:a.id}}),d()}catch(a){console.error("Error deleting discussion:",a)}},v=async()=>{try{await s({variables:{id:a.id}}),d()}catch(a){console.error("Error toggling pin:",a)}},w=a=>a.firstName&&a.lastName?`${a.firstName} ${a.lastName}`:a.username;return(0,b.jsxs)("div",{className:"bg-white rounded-xl shadow-md p-6 mb-4 border border-gray-100",children:[(0,b.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex gap-3 flex-1",children:[(0,b.jsx)("img",{src:a.user.avatar||"/default-avatar.png",alt:a.user.username,className:"w-12 h-12 rounded-full object-cover"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 flex-wrap",children:[(0,b.jsx)("h3",{className:"font-bold text-lg text-gray-900",children:a.title}),a.isPinned&&(0,b.jsxs)("span",{className:"flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full",children:[(0,b.jsx)(S.Pin,{className:"w-3 h-3"}),"Đã ghim"]})]}),(0,b.jsxs)("p",{className:"text-sm text-gray-600",children:["by ",w(a.user)," • ",new Date(a.createdAt).toLocaleDateString("vi-VN")]})]})]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[f&&(0,b.jsx)("button",{onClick:v,className:"p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors",title:a.isPinned?"Bỏ ghim":"Ghim",children:(0,b.jsx)(S.Pin,{className:"w-5 h-5"})}),(f||g)&&(0,b.jsx)("button",{onClick:u,className:"p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors",title:"Xóa",children:(0,b.jsx)(L.Trash2,{className:"w-5 h-5"})})]})]}),(0,b.jsx)("div",{className:"prose max-w-none mb-4 pl-15",children:(0,b.jsx)("p",{className:"text-gray-700 whitespace-pre-wrap",children:a.content})}),(0,b.jsxs)("div",{className:"border-t border-gray-200 pt-4 mt-4",children:[(0,b.jsxs)("button",{onClick:()=>k(!j),className:"flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-3",children:[(0,b.jsx)(R.MessageCircle,{className:"w-4 h-4"}),a.replies.length," ",(a.replies.length,"phản hồi"),j?(0,b.jsx)(V.ChevronUp,{className:"w-4 h-4"}):(0,b.jsx)(U.ChevronDown,{className:"w-4 h-4"})]}),j&&(0,b.jsxs)(b.Fragment,{children:[a.replies.length>0&&(0,b.jsx)("div",{className:"space-y-3 mb-4",children:a.replies.map(a=>(0,b.jsxs)("div",{className:"flex gap-3 pl-4 border-l-2 border-gray-200",children:[(0,b.jsx)("img",{src:a.user.avatar||"/default-avatar.png",alt:a.user.username,className:"w-8 h-8 rounded-full object-cover"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"bg-gray-50 rounded-lg p-3",children:[(0,b.jsx)("p",{className:"text-sm font-medium text-gray-900 mb-1",children:w(a.user)}),(0,b.jsx)("p",{className:"text-sm text-gray-700 whitespace-pre-wrap",children:a.content})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3 mt-1 text-xs text-gray-500",children:[(0,b.jsx)("span",{children:new Date(a.createdAt).toLocaleDateString("vi-VN")}),(0,b.jsxs)("button",{onClick:()=>p(a.id),className:"flex items-center gap-1 hover:text-blue-600",children:[(0,b.jsx)(T.Reply,{className:"w-3 h-3"}),"Reply"]})]}),a.children?.length>0&&(0,b.jsx)("div",{className:"mt-3 space-y-2 pl-4 border-l-2 border-gray-100",children:a.children.map(a=>(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)("img",{src:a.user.avatar||"/default-avatar.png",alt:a.user.username,className:"w-6 h-6 rounded-full object-cover"}),(0,b.jsxs)("div",{className:"flex-1 bg-gray-50 rounded-lg p-2",children:[(0,b.jsx)("p",{className:"text-xs font-medium text-gray-900 mb-1",children:w(a.user)}),(0,b.jsx)("p",{className:"text-xs text-gray-700",children:a.content})]})]},a.id))})]})]},a.id))}),(0,b.jsxs)("div",{className:"flex gap-3",children:[(0,b.jsx)("textarea",{value:h,onChange:a=>i(a.target.value),placeholder:o?"Viết phản hồi...":"Viết bình luận...",className:"flex-1 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none",rows:3}),(0,b.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,b.jsx)("button",{onClick:t,disabled:!h.trim(),className:"px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-sm font-medium",children:"Phản hồi"}),o&&(0,b.jsx)("button",{onClick:()=>p(null),className:"px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm",children:"Hủy"})]})]})]})]})]})}var X=a.i(411185),Y=a.i(358054),Z=a.i(26720),$=a.i(202076),_=a.i(147678),aa=a.i(187145),ab=a.i(473515),ac=a.i(723593),ad=a.i(951369),ae=a.i(785694),af=a.i(772451),ag=a.i(251326),ah=a.i(109375),ai=a.i(478184),aj=a.i(466577);function ak(){let a=(0,o.useParams)(),g=a?.slug,{user:h,isAuthenticated:i}=(0,t.useAuth)(),[l,m]=(0,c.useState)("overview"),[n,q]=(0,c.useState)(!1),[s,w]=(0,c.useState)(""),[x,z]=(0,c.useState)(""),{data:B,loading:E,error:F}=(0,d.useQuery)(f.GET_COURSE_BY_SLUG,{variables:{slug:g},skip:!g}),{data:G,refetch:H}=(0,d.useQuery)(f.GET_ENROLLMENT,{variables:{courseId:B?.courseBySlug?.id||""},skip:!B?.courseBySlug?.id||!i});(0,c.useEffect)(()=>{i&&B?.courseBySlug?.id&&H()},[i,B?.courseBySlug?.id,H]);let{data:I,refetch:J}=(0,d.useQuery)(j,{variables:{courseId:B?.courseBySlug?.id},skip:!B?.courseBySlug?.id||"discussions"!==l}),[K]=(0,e.useMutation)(k,{onCompleted:()=>{q(!1),w(""),z(""),J()}});if(E)return(0,b.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,b.jsx)("div",{className:"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",children:(0,b.jsxs)("div",{className:"container mx-auto px-4 py-8 md:py-16",children:[(0,b.jsx)(af.Skeleton,{className:"h-10 w-3/4 mb-4 bg-primary-foreground/20"}),(0,b.jsx)(af.Skeleton,{className:"h-6 w-1/2 bg-primary-foreground/20"})]})}),(0,b.jsx)("div",{className:"container mx-auto px-4 py-6",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[(0,b.jsx)("div",{className:"lg:col-span-2 space-y-4",children:(0,b.jsx)(af.Skeleton,{className:"h-[400px] w-full"})}),(0,b.jsx)("div",{className:"lg:col-span-1",children:(0,b.jsx)(af.Skeleton,{className:"h-[500px] w-full"})})]})})]});if(F||!B?.courseBySlug)return(0,b.jsx)("div",{className:"min-h-screen bg-background flex items-center justify-center p-4",children:(0,b.jsx)(C.Card,{className:"max-w-md w-full",children:(0,b.jsxs)(C.CardHeader,{children:[(0,b.jsx)(C.CardTitle,{children:"Không tìm thấy khóa học"}),(0,b.jsx)(C.CardDescription,{children:"Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."})]})})});let L=B.courseBySlug,M=L.modules?.reduce((a,b)=>a+(b.lessons?.length||0),0)||0,N=async a=>{if(a.preventDefault(),s.trim()&&x.trim())try{await K({variables:{input:{courseId:L.id,title:s,content:x}}})}catch(a){console.error("Error creating discussion:",a)}};return(0,b.jsxs)("div",{className:"min-h-screen bg-background",children:[(0,b.jsx)("div",{className:"bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",children:(0,b.jsx)("div",{className:"container mx-auto px-4 py-8 md:py-12 lg:py-16",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8",children:[(0,b.jsxs)("div",{className:"lg:col-span-2 space-y-4 md:space-y-6",children:[L.category&&(0,b.jsx)(O.Badge,{variant:"secondary",className:"mb-2",children:L.category.name}),(0,b.jsx)("h1",{className:"text-3xl md:text-4xl lg:text-5xl font-bold leading-tight",children:L.title}),(0,b.jsx)("p",{className:"text-lg md:text-xl text-primary-foreground/90",children:L.description}),(0,b.jsxs)("div",{className:"flex flex-wrap items-center gap-4 md:gap-6",children:[(0,b.jsx)(y,{rating:L.avgRating,size:"lg",showNumber:!0,reviewCount:L.reviewCount}),(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(Y.Users,{className:"w-4 h-4 md:w-5 md:h-5"}),(0,b.jsxs)("span",{className:"text-sm md:text-base",children:[L.enrollmentCount," học viên"]})]})]}),L.instructor&&(0,b.jsxs)("div",{className:"flex items-center gap-3 pt-2",children:[(0,b.jsxs)(ag.Avatar,{className:"w-10 h-10 md:w-12 md:h-12",children:[(0,b.jsx)(ag.AvatarImage,{src:L.instructor.avatar||"",alt:L.instructor.username}),(0,b.jsx)(ag.AvatarFallback,{children:L.instructor.firstName?.[0]||L.instructor.username[0]})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs md:text-sm text-primary-foreground/70",children:"Tạo bởi"}),(0,b.jsx)("p",{className:"font-medium text-sm md:text-base",children:L.instructor.firstName&&L.instructor.lastName?`${L.instructor.firstName} ${L.instructor.lastName}`:L.instructor.username})]})]}),(0,b.jsx)("div",{className:"bg-white rounded-lg container mx-auto px-4 py-6 md:py-8 lg:py-12 pb-24 lg:pb-12",children:(0,b.jsxs)(ad.Tabs,{defaultValue:"overview",className:"w-full",children:[(0,b.jsxs)(ad.TabsList,{className:"w-full justify-start overflow-x-auto flex-nowrap h-auto p-1",children:[(0,b.jsx)(ad.TabsTrigger,{value:"overview",className:"text-xs md:text-sm",children:"Tổng quan"}),(0,b.jsxs)(ad.TabsTrigger,{value:"content",className:"text-xs md:text-sm",children:[(0,b.jsx)(Z.BookOpen,{className:"w-4 h-4 mr-1.5"}),"Nội dung"]}),(0,b.jsx)(ad.TabsTrigger,{value:"reviews",className:"text-xs md:text-sm",children:"Đánh giá"}),(0,b.jsxs)(ad.TabsTrigger,{value:"discussions",className:"text-xs md:text-sm",children:[(0,b.jsx)(A.MessageSquare,{className:"w-4 h-4 mr-1.5"}),"Thảo luận"]})]}),(0,b.jsxs)(ad.TabsContent,{value:"overview",className:"mt-6 space-y-6",children:[(0,b.jsxs)(C.Card,{className:"lg:hidden",children:[(0,b.jsx)(C.CardHeader,{children:(0,b.jsx)(C.CardTitle,{className:"text-lg",children:"Thông tin khóa học"})}),(0,b.jsx)(C.CardContent,{className:"space-y-4",children:(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"flex items-start gap-2",children:[(0,b.jsx)(_.Award,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Cấp độ"}),(0,b.jsx)("p",{className:"text-sm font-medium",children:L.level})]})]}),L.duration&&(0,b.jsxs)("div",{className:"flex items-start gap-2",children:[(0,b.jsx)(X.Clock,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Thời lượng"}),(0,b.jsxs)("p",{className:"text-sm font-medium",children:[Math.floor(L.duration/60),"h ",L.duration%60,"m"]})]})]}),(0,b.jsxs)("div",{className:"flex items-start gap-2",children:[(0,b.jsx)(Z.BookOpen,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Bài học"}),(0,b.jsxs)("p",{className:"text-sm font-medium",children:[M," bài học"]})]})]}),(0,b.jsxs)("div",{className:"flex items-start gap-2",children:[(0,b.jsx)($.Globe,{className:"w-4 h-4 text-muted-foreground mt-0.5"}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ngôn ngữ"}),(0,b.jsx)("p",{className:"text-sm font-medium",children:"Tiếng Việt"})]})]})]})})]}),L.whatYouWillLearn&&L.whatYouWillLearn.length>0&&(0,b.jsxs)(C.Card,{children:[(0,b.jsx)(C.CardHeader,{children:(0,b.jsx)(C.CardTitle,{children:"Bạn sẽ học được gì"})}),(0,b.jsx)(C.CardContent,{children:(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4",children:L.whatYouWillLearn.map((a,c)=>(0,b.jsxs)("div",{className:"flex items-start gap-2 md:gap-3",children:[(0,b.jsx)(r.CheckCircle,{className:"w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-0.5"}),(0,b.jsx)("span",{className:"text-sm md:text-base",children:a})]},c))})})]}),L.requirements&&L.requirements.length>0&&(0,b.jsxs)(C.Card,{children:[(0,b.jsx)(C.CardHeader,{children:(0,b.jsx)(C.CardTitle,{children:"Yêu cầu"})}),(0,b.jsx)(C.CardContent,{children:(0,b.jsx)("ul",{className:"space-y-2",children:L.requirements.map((a,c)=>(0,b.jsxs)("li",{className:"flex items-start gap-2 md:gap-3 text-sm md:text-base",children:[(0,b.jsx)("span",{className:"text-muted-foreground",children:"•"}),a]},c))})})]})]}),(0,b.jsx)(ad.TabsContent,{value:"content",className:"mt-6",children:(0,b.jsxs)(C.Card,{children:[(0,b.jsxs)(C.CardHeader,{children:[(0,b.jsx)(C.CardTitle,{children:"Nội dung khóa học"}),(0,b.jsxs)(C.CardDescription,{children:[L.modules?.length||0," chương • ",M," bài học"]})]}),(0,b.jsx)(C.CardContent,{children:L.modules&&L.modules.length>0?(0,b.jsx)(ah.Accordion,{type:"single",collapsible:!0,defaultValue:"item-0",className:"w-full",children:L.modules.map((a,c)=>(0,b.jsxs)(ah.AccordionItem,{value:`item-${c}`,children:[(0,b.jsx)(ah.AccordionTrigger,{className:"hover:no-underline",children:(0,b.jsxs)("div",{className:"flex items-center justify-between w-full pr-4 text-left",children:[(0,b.jsxs)("span",{className:"font-semibold text-sm md:text-base",children:[c+1,". ",a.title]}),(0,b.jsxs)(O.Badge,{variant:"secondary",className:"text-xs",children:[a.lessons?.length||0," bài"]})]})}),(0,b.jsx)(ah.AccordionContent,{children:(0,b.jsx)("div",{className:"space-y-1 pt-2",children:a.lessons?.map((a,d)=>(0,b.jsxs)("div",{className:"flex items-center gap-2 md:gap-3 p-2 md:p-3 hover:bg-accent rounded-lg transition-colors",children:["VIDEO"===a.type?(0,b.jsx)(aa.PlayCircle,{className:"w-4 h-4 text-muted-foreground flex-shrink-0"}):(0,b.jsx)(ab.FileText,{className:"w-4 h-4 text-muted-foreground flex-shrink-0"}),(0,b.jsxs)("span",{className:"text-sm md:text-base flex-1",children:[c+1,".",d+1," ",a.title]}),a.duration&&(0,b.jsxs)("span",{className:"text-xs md:text-sm text-muted-foreground",children:[a.duration," phút"]})]},a.id))})})]},a.id))}):(0,b.jsx)(D.Alert,{children:(0,b.jsx)(D.AlertDescription,{children:"Chưa có nội dung khóa học."})})})]})}),(0,b.jsx)(ad.TabsContent,{value:"reviews",className:"mt-6",children:(0,b.jsx)(C.Card,{children:(0,b.jsx)(C.CardContent,{className:"p-4 md:p-6",children:(0,b.jsx)(Q,{courseId:L.id,currentUserId:h?.id,isEnrolled:!!G?.enrollment})})})}),(0,b.jsx)(ad.TabsContent,{value:"discussions",className:"mt-6",children:(0,b.jsx)(C.Card,{children:(0,b.jsxs)(C.CardContent,{className:"p-4 md:p-6 space-y-6",children:[G?.enrollment&&!n&&(0,b.jsxs)(u.Button,{onClick:()=>q(!0),className:"w-full",size:"lg",children:[(0,b.jsx)(ac.Plus,{className:"w-5 h-5 mr-2"}),"Bắt đầu thảo luận mới"]}),n&&(0,b.jsxs)(C.Card,{className:"border-2",children:[(0,b.jsx)(C.CardHeader,{children:(0,b.jsx)(C.CardTitle,{className:"text-lg",children:"Thảo luận mới"})}),(0,b.jsx)(C.CardContent,{children:(0,b.jsxs)("form",{onSubmit:N,className:"space-y-4",children:[(0,b.jsx)("div",{children:(0,b.jsx)(ai.Input,{type:"text",value:s,onChange:a=>w(a.target.value),placeholder:"Tiêu đề thảo luận...",required:!0})}),(0,b.jsx)("div",{children:(0,b.jsx)(aj.Textarea,{value:x,onChange:a=>z(a.target.value),placeholder:"Bạn muốn thảo luận điều gì?",rows:4,required:!0})}),(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row gap-3",children:[(0,b.jsx)(u.Button,{type:"submit",className:"flex-1 sm:flex-none",children:"Đăng thảo luận"}),(0,b.jsx)(u.Button,{type:"button",variant:"outline",onClick:()=>{q(!1),w(""),z("")},className:"flex-1 sm:flex-none",children:"Hủy"})]})]})})]}),G?.enrollment?I?.courseDiscussions&&I.courseDiscussions.length>0?(0,b.jsx)("div",{className:"space-y-4",children:I.courseDiscussions.map(a=>(0,b.jsx)(W,{discussion:a,refetch:J,canModerate:L.instructor?.id===h?.id,isOwner:a.user.id===h?.id},a.id))}):(0,b.jsxs)(D.Alert,{children:[(0,b.jsx)(A.MessageSquare,{className:"w-4 h-4"}),(0,b.jsx)(D.AlertDescription,{children:"Chưa có thảo luận nào. Hãy là người đầu tiên bắt đầu!"})]}):(0,b.jsxs)(D.Alert,{children:[(0,b.jsx)(A.MessageSquare,{className:"w-4 h-4"}),(0,b.jsx)(D.AlertDescription,{children:"Ghi danh khóa học này để tham gia thảo luận"})]})]})})})]})})]}),(0,b.jsx)("div",{className:"hidden lg:block",children:(0,b.jsx)(C.Card,{className:"sticky top-4 shadow-lg",children:(0,b.jsxs)(C.CardContent,{className:"p-6 space-y-6",children:[L.thumbnail&&(0,b.jsx)("div",{className:"relative h-48 rounded-lg overflow-hidden",children:(0,b.jsx)(p.default,{src:L.thumbnail,alt:L.title,fill:!0,className:"object-cover"})}),(0,b.jsx)("div",{className:"text-3xl font-bold",children:L.price>0?`${L.price.toLocaleString("vi-VN")}đ`:"Miễn phí"}),(0,b.jsx)(v,{courseId:L.id,courseSlug:L.slug,price:L.price,isEnrolled:!!G?.enrollment}),(0,b.jsx)(ae.Separator,{}),(0,b.jsxs)("div",{className:"space-y-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(_.Award,{className:"w-5 h-5 text-muted-foreground"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Cấp độ"}),(0,b.jsx)("p",{className:"font-medium",children:L.level})]})]}),L.duration&&(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(X.Clock,{className:"w-5 h-5 text-muted-foreground"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Thời lượng"}),(0,b.jsxs)("p",{className:"font-medium",children:[Math.floor(L.duration/60),"h ",L.duration%60,"m"]})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)(Z.BookOpen,{className:"w-5 h-5 text-muted-foreground"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Bài học"}),(0,b.jsxs)("p",{className:"font-medium",children:[M," bài học"]})]})]}),(0,b.jsxs)("div",{className:"flex items-center gap-3",children:[(0,b.jsx)($.Globe,{className:"w-5 h-5 text-muted-foreground"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Ngôn ngữ"}),(0,b.jsx)("p",{className:"font-medium",children:"Tiếng Việt"})]})]})]})]})})})]})})}),(0,b.jsx)("div",{className:"lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-50",children:(0,b.jsxs)("div",{className:"container mx-auto px-4 py-3 flex items-center justify-between gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Giá khóa học"}),(0,b.jsx)("p",{className:"text-xl font-bold",children:L.price>0?`${L.price.toLocaleString("vi-VN")}đ`:"Miễn phí"})]}),(0,b.jsx)(v,{courseId:L.id,courseSlug:L.slug,price:L.price,isEnrolled:!!G?.enrollment})]})})]})}a.s(["default",()=>ak],756883)}];

//# sourceMappingURL=frontend_src_app_lms_courses_%5Bslug%5D_page_tsx_827df2d9._.js.map