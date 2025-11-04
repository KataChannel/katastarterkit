module.exports=[57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},605751,a=>{"use strict";let b=(0,a.i(367990).default)("clock",[["path",{d:"M12 6v6l4 2",key:"mmk7yg"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);a.s(["default",()=>b])},411185,a=>{"use strict";var b=a.i(605751);a.s(["Clock",()=>b.default])},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},829555,(a,b,c)=>{"use strict";c._=function(a){return a&&a.__esModule?a:{default:a}}},530914,a=>{"use strict";var b=a.i(772213);let c=b.gql`
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
`;a.s(["GET_BLOGS",0,c,"GET_BLOG_BY_SLUG",0,d,"GET_BLOG_CATEGORIES",0,e])},123036,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(439889),f=a.i(734639),g=a.i(530914),h=a.i(629432),i=a.i(128348),j=a.i(779149),k=a.i(411185),l=a.i(57597);function m(){let[a,m]=(0,c.useState)(1),[n,o]=(0,c.useState)(null),[p,q]=(0,c.useState)(""),[r,s]=(0,c.useState)("newest"),{data:t,loading:u,error:v}=(0,d.useQuery)(g.GET_BLOGS,{variables:{input:{page:a,limit:12,categoryId:n,search:p||void 0,sort:r,isPublished:!0}}}),{data:w}=(0,d.useQuery)(g.GET_BLOG_CATEGORIES),x=t?.getBlogs?.blogs||[],y=t?.getBlogs?.total||0,z=12*a<y,A=w?.getBlogCategories||[];return(0,b.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,b.jsx)("div",{className:"bg-gradient-to-r from-blue-600 to-purple-600 text-white",children:(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12",children:[(0,b.jsx)("h1",{className:"text-4xl font-bold mb-4",children:"Blog"}),(0,b.jsx)("p",{className:"text-xl opacity-90",children:"Khám phá kiến thức, xu hướng và cập nhật mới nhất"})]})}),(0,b.jsx)("div",{className:"bg-white border-b",children:(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",children:(0,b.jsxs)("div",{className:"flex flex-col sm:flex-row gap-4",children:[(0,b.jsxs)("div",{className:"flex-1 relative",children:[(0,b.jsx)("input",{type:"text",value:p,onChange:a=>q(a.target.value),placeholder:"Tìm kiếm bài viết...",className:"w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"}),(0,b.jsx)(h.Search,{className:"absolute left-4 top-3.5 h-5 w-5 text-gray-400"})]}),(0,b.jsxs)("select",{value:r,onChange:a=>s(a.target.value),className:"px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",children:[(0,b.jsx)("option",{value:"newest",children:"Mới nhất"}),(0,b.jsx)("option",{value:"oldest",children:"Cũ nhất"}),(0,b.jsx)("option",{value:"popular",children:"Phổ biến nhất"})]})]})})}),(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:(0,b.jsxs)("div",{className:"flex flex-col lg:flex-row gap-8",children:[(0,b.jsx)("aside",{className:"lg:w-64 flex-shrink-0",children:(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm p-6 sticky top-4",children:[(0,b.jsx)("h3",{className:"font-bold text-gray-900 mb-4",children:"Danh mục"}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("button",{onClick:()=>o(null),className:`w-full text-left px-3 py-2 rounded-md transition ${null===n?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:"Tất cả"}),A.map(a=>(0,b.jsx)("button",{onClick:()=>o(a.id),className:`w-full text-left px-3 py-2 rounded-md transition ${n===a.id?"bg-blue-50 text-blue-700 font-medium":"text-gray-700 hover:bg-gray-50"}`,children:a.name},a.id))]}),(0,b.jsxs)("div",{className:"mt-8",children:[(0,b.jsxs)("h3",{className:"font-bold text-gray-900 mb-4 flex items-center gap-2",children:[(0,b.jsx)(l.TrendingUp,{className:"h-5 w-5"}),"Thẻ phổ biến"]}),(0,b.jsx)("div",{className:"flex flex-wrap gap-2",children:["Công nghệ","Kinh doanh","Marketing","Thiết kế","Đời sống"].map(a=>(0,b.jsxs)("span",{className:"px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition",children:["#",a]},a))})]})]})}),(0,b.jsxs)("main",{className:"flex-1",children:[u&&(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:[...Array(6)].map((a,c)=>(0,b.jsxs)("div",{className:"bg-white rounded-lg shadow-sm overflow-hidden animate-pulse",children:[(0,b.jsx)("div",{className:"bg-gray-200 h-48"}),(0,b.jsxs)("div",{className:"p-4 space-y-3",children:[(0,b.jsx)("div",{className:"bg-gray-200 h-4 rounded"}),(0,b.jsx)("div",{className:"bg-gray-200 h-4 rounded w-2/3"})]})]},c))}),v&&(0,b.jsxs)("div",{className:"bg-red-50 text-red-700 p-4 rounded-lg",children:["Có lỗi xảy ra: ",v.message]}),!u&&x.length>0&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",children:x.map(a=>(0,b.jsxs)(e.default,{href:`/blog/${a.slug}`,className:"bg-white rounded-lg shadow-sm hover:shadow-md transition group overflow-hidden",children:[a.featuredImage&&(0,b.jsxs)("div",{className:"relative aspect-video overflow-hidden",children:[(0,b.jsx)(f.default,{src:a.featuredImage,alt:a.title,fill:!0,className:"object-cover group-hover:scale-105 transition duration-300"}),a.category&&(0,b.jsx)("span",{className:"absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full",children:a.category.name})]}),(0,b.jsxs)("div",{className:"p-4",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 text-xs text-gray-500 mb-2",children:[(0,b.jsxs)("span",{className:"flex items-center gap-1",children:[(0,b.jsx)(i.Calendar,{className:"h-3 w-3"}),new Date(a.publishedAt||a.createdAt).toLocaleDateString("vi-VN",{year:"numeric",month:"long",day:"numeric"})]}),a.viewCount>0&&(0,b.jsxs)("span",{children:[a.viewCount," lượt xem"]})]}),(0,b.jsx)("h2",{className:"font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition",children:a.title}),a.shortDescription&&(0,b.jsx)("p",{className:"text-gray-600 text-sm mb-3 line-clamp-3",children:a.shortDescription}),(0,b.jsxs)("div",{className:"flex items-center justify-between pt-3 border-t",children:[(0,b.jsxs)("div",{className:"flex items-center gap-2",children:[(0,b.jsx)(j.User,{className:"h-4 w-4 text-gray-400"}),(0,b.jsx)("span",{className:"text-sm text-gray-600",children:a.author?.fullName||a.author?.email||"Admin"})]}),a.readingTime&&(0,b.jsxs)("div",{className:"flex items-center gap-1 text-gray-500 text-sm",children:[(0,b.jsx)(k.Clock,{className:"h-4 w-4"}),(0,b.jsxs)("span",{children:[a.readingTime," phút"]})]})]}),a.tags&&a.tags.length>0&&(0,b.jsx)("div",{className:"flex flex-wrap gap-2 mt-3",children:a.tags.slice(0,3).map(a=>(0,b.jsxs)("span",{className:"px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded",children:["#",a.name]},a.id))})]})]},a.id))}),(0,b.jsxs)("div",{className:"mt-8 flex justify-center gap-2",children:[(0,b.jsx)("button",{onClick:()=>m(Math.max(1,a-1)),disabled:1===a,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition",children:"Trước"}),(0,b.jsxs)("span",{className:"px-4 py-2 text-gray-700",children:["Trang ",a," / ",Math.ceil(y/12)]}),(0,b.jsx)("button",{onClick:()=>m(a+1),disabled:!z,className:"px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition",children:"Sau"})]})]}),!u&&0===x.length&&(0,b.jsx)("div",{className:"text-center py-12 bg-white rounded-lg",children:(0,b.jsx)("p",{className:"text-gray-500 text-lg",children:"Không tìm thấy bài viết nào"})})]})]})})]})}a.s(["default",()=>m])}];

//# sourceMappingURL=_04493b69._.js.map