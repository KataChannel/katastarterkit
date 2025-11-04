module.exports=[196915,a=>{"use strict";let b=(0,a.i(367990).default)("eye",[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);a.s(["default",()=>b])},785903,a=>{"use strict";var b=a.i(196915);a.s(["Eye",()=>b.default])},605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},117688,a=>{"use strict";let b=(0,a.i(367990).default)("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]);a.s(["default",()=>b])},871925,a=>{"use strict";var b=a.i(117688);a.s(["Tag",()=>b.default])},36755,a=>{"use strict";let b=(0,a.i(367990).default)("facebook",[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]]);a.s(["default",()=>b])},508477,a=>{"use strict";var b=a.i(36755);a.s(["Facebook",()=>b.default])},346006,a=>{"use strict";let b=(0,a.i(367990).default)("twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]);a.s(["default",()=>b])},902854,a=>{"use strict";let b=(0,a.i(367990).default)("linkedin",[["path",{d:"M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",key:"c2jq9f"}],["rect",{width:"4",height:"12",x:"2",y:"9",key:"mk3on5"}],["circle",{cx:"4",cy:"4",r:"2",key:"bt5ra8"}]]);a.s(["default",()=>b])},56463,a=>{"use strict";var b=a.i(346006);a.s(["Twitter",()=>b.default])},548169,a=>{"use strict";var b=a.i(902854);a.s(["Linkedin",()=>b.default])},530914,a=>{"use strict";var b=a.i(772213);let c=b.gql`
  query GetBlogs(
    $page: Int
    $limit: Int
    $search: String
    $categoryId: ID
    $sort: String
  ) {
    blogs(
      page: $page
      limit: $limit
      search: $search
      categoryId: $categoryId
      sort: $sort
    ) {
      items {
        id
        title
        slug
        shortDescription
        excerpt
        author
        thumbnailUrl
        viewCount
        publishedAt
        category {
          id
          name
          slug
        }
        tags {
          id
          name
          slug
        }
        isFeatured
        isPublished
      }
      total
      page
      pageSize
      totalPages
      hasMore
    }
  }
`,d=b.gql`
  query GetBlogBySlug($slug: String!) {
    blogBySlug(slug: $slug) {
      id
      title
      slug
      content
      shortDescription
      excerpt
      author
      thumbnailUrl
      bannerUrl
      viewCount
      publishedAt
      updatedAt
      category {
        id
        name
        slug
      }
      tags {
        id
        name
        slug
      }
      isFeatured
      isPublished
      metaTitle
      metaDescription
      metaKeywords
      createdAt
    }
  }
`;b.gql`
  query GetFeaturedBlogs($limit: Int) {
    featuredBlogs(limit: $limit) {
      id
      title
      slug
      shortDescription
      thumbnailUrl
      author
      publishedAt
      category {
        id
        name
        slug
      }
    }
  }
`,b.gql`
  query GetBlogsByCategory($categoryId: ID!, $limit: Int, $page: Int) {
    blogsByCategory(categoryId: $categoryId, limit: $limit, page: $page) {
      items {
        id
        title
        slug
        shortDescription
        excerpt
        author
        thumbnailUrl
        viewCount
        publishedAt
        category {
          id
          name
          slug
        }
        isFeatured
      }
      total
      page
      pageSize
      totalPages
      hasMore
    }
  }
`,b.gql`
  query GetRelatedBlogs($categoryId: ID!, $excludeBlogId: ID!, $limit: Int) {
    relatedBlogs(categoryId: $categoryId, excludeBlogId: $excludeBlogId, limit: $limit) {
      id
      title
      slug
      shortDescription
      thumbnailUrl
      author
      publishedAt
      viewCount
      category {
        id
        name
        slug
      }
    }
  }
`;let e=b.gql`
  query GetBlogCategories {
    blogCategories {
      id
      name
      slug
      description
      thumbnail
    }
  }
`;a.s(["GET_BLOGS",0,c,"GET_BLOG_BY_SLUG",0,d,"GET_BLOG_CATEGORIES",0,e])},134075,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(53627),f=a.i(734639),g=a.i(439889),h=a.i(530914),i=a.i(128348),j=a.i(779149),k=a.i(411185),l=a.i(871925),m=a.i(785903),n=a.i(508477),o=a.i(56463),p=a.i(548169),q=a.i(646254),r=a.i(502794);function s(){let a=(0,e.useParams)(),s=(0,e.useRouter)(),t=a?.slug,[u,v]=(0,c.useState)(""),[w,x]=(0,c.useState)(null),{data:y,loading:z,error:A}=(0,d.useQuery)(h.GET_BLOG_BY_SLUG,{variables:{slug:t},skip:!t}),B=y?.getBlogBySlug,C=a=>new Date(a).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"}),D=async a=>{a.preventDefault(),alert("Chức năng bình luận đang được phát triển")},E=a=>{let b=window.location.href,c=B?.title,d="";switch(a){case"facebook":d=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(b)}`;break;case"twitter":d=`https://twitter.com/intent/tweet?url=${encodeURIComponent(b)}&text=${encodeURIComponent(c)}`;break;case"linkedin":d=`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(b)}`}d&&window.open(d,"_blank","width=600,height=400")};return z?(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})}):A||!B?(0,b.jsx)("div",{className:"min-h-screen flex items-center justify-center",children:(0,b.jsxs)("div",{className:"text-center",children:[(0,b.jsx)("h1",{className:"text-2xl font-bold text-gray-900 mb-2",children:"Không tìm thấy bài viết"}),(0,b.jsx)("button",{onClick:()=>s.push("/blog"),className:"text-blue-600 hover:underline",children:"← Quay lại danh sách blog"})]})}):(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[B.featuredImage&&(0,b.jsxs)("div",{className:"relative h-96 bg-gray-900",children:[(0,b.jsx)(f.default,{src:B.featuredImage,alt:B.title,fill:!0,className:"object-cover opacity-70",priority:!0}),(0,b.jsx)("div",{className:"absolute inset-0 flex items-center justify-center",children:(0,b.jsxs)("div",{className:"max-w-4xl mx-auto px-4 text-center",children:[B.category&&(0,b.jsx)("span",{className:"inline-block px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full mb-4",children:B.category.name}),(0,b.jsx)("h1",{className:"text-4xl md:text-5xl font-bold text-white mb-4",children:B.title}),(0,b.jsxs)("div",{className:"flex items-center justify-center gap-6 text-white/90 text-sm",children:[(0,b.jsxs)("span",{className:"flex items-center gap-2",children:[(0,b.jsx)(i.Calendar,{className:"h-4 w-4"}),C(B.publishedAt||B.createdAt)]}),(0,b.jsxs)("span",{className:"flex items-center gap-2",children:[(0,b.jsx)(j.User,{className:"h-4 w-4"}),B.author?.fullName||B.author?.email||"Admin"]}),(0,b.jsxs)("span",{className:"flex items-center gap-2",children:[(0,b.jsx)(k.Clock,{className:"h-4 w-4"}),B.readingTime," phút đọc"]}),(0,b.jsxs)("span",{className:"flex items-center gap-2",children:[(0,b.jsx)(m.Eye,{className:"h-4 w-4"}),B.viewCount," lượt xem"]})]})]})})]}),(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-8",children:[(0,b.jsxs)("article",{className:"lg:col-span-2",children:[(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-8",children:[B.shortDescription&&(0,b.jsx)("div",{className:"text-xl text-gray-700 italic mb-6 pb-6 border-b",children:B.shortDescription}),(0,b.jsx)("div",{className:"prose prose-lg max-w-none mb-8",dangerouslySetInnerHTML:{__html:B.content}}),B.tags&&B.tags.length>0&&(0,b.jsxs)("div",{className:"flex flex-wrap gap-2 mb-6 pb-6 border-t pt-6",children:[(0,b.jsx)(l.Tag,{className:"h-5 w-5 text-gray-400"}),B.tags.map(a=>(0,b.jsxs)(g.default,{href:`/blog?tag=${a.slug}`,className:"px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition text-sm",children:["#",a.name]},a.id))]}),(0,b.jsxs)("div",{className:"flex items-center gap-4 pb-6 border-b",children:[(0,b.jsx)("span",{className:"font-medium text-gray-700",children:"Chia sẻ:"}),(0,b.jsx)("button",{onClick:()=>E("facebook"),className:"p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition",title:"Chia sẻ lên Facebook",children:(0,b.jsx)(n.Facebook,{className:"h-5 w-5"})}),(0,b.jsx)("button",{onClick:()=>E("twitter"),className:"p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition",title:"Chia sẻ lên Twitter",children:(0,b.jsx)(o.Twitter,{className:"h-5 w-5"})}),(0,b.jsx)("button",{onClick:()=>E("linkedin"),className:"p-2 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition",title:"Chia sẻ lên LinkedIn",children:(0,b.jsx)(p.Linkedin,{className:"h-5 w-5"})})]}),B.author&&(0,b.jsxs)("div",{className:"mt-8 p-6 bg-gray-50 rounded-lg",children:[(0,b.jsx)("h3",{className:"font-bold text-gray-900 mb-2",children:"Về tác giả"}),(0,b.jsxs)("div",{className:"flex items-start gap-4",children:[(0,b.jsx)("div",{className:"w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center",children:(0,b.jsx)(j.User,{className:"h-8 w-8 text-gray-500"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"font-medium text-gray-900",children:B.author.fullName||B.author.email}),(0,b.jsx)("p",{className:"text-sm text-gray-600 mt-1",children:"Biên tập viên tại Kata Shop"})]})]})]})]}),(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-8 mt-8",children:[(0,b.jsxs)("h2",{className:"text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2",children:[(0,b.jsx)(q.MessageCircle,{className:"h-6 w-6"}),"Bình luận (",B.comments?.length||0,")"]}),(0,b.jsxs)("form",{onSubmit:D,className:"mb-8",children:[(0,b.jsx)("textarea",{value:u,onChange:a=>v(a.target.value),placeholder:"Viết bình luận của bạn...",rows:4,className:"w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,b.jsxs)("div",{className:"flex justify-between items-center mt-3",children:[w&&(0,b.jsx)("button",{type:"button",onClick:()=>x(null),className:"text-sm text-gray-600 hover:text-gray-900",children:"Hủy trả lời"}),(0,b.jsxs)("button",{type:"submit",disabled:!u.trim(),className:"ml-auto flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition",children:[(0,b.jsx)(r.Send,{className:"h-4 w-4"}),"Gửi bình luận"]})]})]}),(0,b.jsx)("div",{className:"space-y-6",children:B.comments?.map(a=>(0,b.jsx)("div",{className:"border-b pb-6 last:border-0",children:(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0",children:(0,b.jsx)(j.User,{className:"h-5 w-5 text-gray-500"})}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,b.jsx)("span",{className:"font-medium text-gray-900",children:a.user?.fullName||a.authorName||"Ẩn danh"}),(0,b.jsx)("span",{className:"text-sm text-gray-500",children:C(a.createdAt)})]}),(0,b.jsx)("p",{className:"text-gray-700 mb-2",children:a.content}),(0,b.jsx)("button",{onClick:()=>x(a.id),className:"text-sm text-blue-600 hover:text-blue-700",children:"Trả lời"}),a.replies&&a.replies.length>0&&(0,b.jsx)("div",{className:"mt-4 ml-8 space-y-4",children:a.replies.map(a=>(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0",children:(0,b.jsx)(j.User,{className:"h-4 w-4 text-gray-500"})}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[(0,b.jsx)("span",{className:"font-medium text-gray-900 text-sm",children:a.user?.fullName||a.authorName||"Ẩn danh"}),(0,b.jsx)("span",{className:"text-xs text-gray-500",children:C(a.createdAt)})]}),(0,b.jsx)("p",{className:"text-gray-700 text-sm",children:a.content})]})]},a.id))})]})]})},a.id))}),(!B.comments||0===B.comments.length)&&(0,b.jsx)("p",{className:"text-center text-gray-500 py-8",children:"Chưa có bình luận nào. Hãy là người đầu tiên bình luận!"})]})]}),(0,b.jsx)("aside",{className:"lg:col-span-1",children:(0,b.jsx)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:(0,b.jsxs)("div",{className:"p-4 bg-blue-50 rounded-lg",children:[(0,b.jsx)("h3",{className:"font-bold text-gray-900 mb-2",children:"Đăng ký nhận tin"}),(0,b.jsx)("p",{className:"text-sm text-gray-600 mb-3",children:"Nhận bài viết mới nhất qua email"}),(0,b.jsx)("input",{type:"email",placeholder:"Email của bạn",className:"w-full px-3 py-2 border border-gray-300 rounded-md mb-2 text-sm"}),(0,b.jsx)("button",{className:"w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium",children:"Đăng ký"})]})})})]})})]})}a.s(["default",()=>s])}];

//# sourceMappingURL=_c8fa8e56._.js.map