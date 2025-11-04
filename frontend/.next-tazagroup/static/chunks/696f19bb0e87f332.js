(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,759727,258392,e=>{"use strict";let t=(0,e.i(930702).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);e.s(["default",()=>t],258392),e.s(["TrendingUp",()=>t],759727)},782145,e=>{"use strict";let t=(0,e.i(930702).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);e.s(["default",()=>t])},435635,e=>{"use strict";var t=e.i(782145);e.s(["Calendar",()=>t.default])},980295,e=>{"use strict";let t=(0,e.i(930702).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);e.s(["default",()=>t])},897711,e=>{"use strict";var t=e.i(980295);e.s(["Download",()=>t.default])},79308,e=>{"use strict";let t=(0,e.i(930702).default)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);e.s(["default",()=>t])},578078,e=>{"use strict";var t=e.i(79308);e.s(["ExternalLink",()=>t.default])},638671,e=>{"use strict";var t=e.i(44990),a=e.i(403055),s=e.i(429105),r=e.i(123959),i=e.i(130775),l=e.i(984804);let d=l.gql`
  fragment CertificateData on Certificate {
    id
    certificateNumber
    courseName
    instructorName
    completionDate
    grade
    verificationUrl
    issueDate
  }
`,n=l.gql`
  query GetMyCertificates {
    myCertificates {
      ...CertificateData
      course {
        id
        title
        slug
        thumbnail
      }
    }
    certificateStats {
      total
      thisMonth
      thisYear
    }
  }
  ${d}
`;l.gql`
  query GetCertificate($id: ID!) {
    certificate(id: $id) {
      ...CertificateData
      user {
        id
        firstName
        lastName
        username
      }
      course {
        id
        title
        slug
        thumbnail
        duration
      }
    }
  }
  ${d}
`,l.gql`
  query VerifyCertificate($certificateNumber: String!) {
    verifyCertificate(certificateNumber: $certificateNumber) {
      valid
      certificate {
        ...CertificateData
        user {
          firstName
          lastName
          username
        }
        course {
          title
          thumbnail
        }
      }
    }
  }
  ${d}
`,l.gql`
  mutation GenerateCertificate($enrollmentId: ID!) {
    generateCertificate(enrollmentId: $enrollmentId) {
      ...CertificateData
    }
  }
  ${d}
`;var c=e.i(865706),m=e.i(897711),o=e.i(578078),h=e.i(435635),x=e.i(579448);function u({certificate:e}){return(0,t.jsxs)("div",{className:"bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-amber-200 hover:shadow-xl transition-all",children:[(0,t.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,t.jsxs)("div",{className:"flex items-start gap-4",children:[(0,t.jsx)("div",{className:"p-3 bg-amber-100 rounded-lg",children:(0,t.jsx)(c.Award,{className:"w-10 h-10 text-amber-600"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-1",children:e.courseName}),(0,t.jsxs)("p",{className:"text-sm text-gray-600 font-mono",children:["#",e.certificateNumber]}),(0,t.jsxs)("p",{className:"text-sm text-gray-500 mt-2",children:["Instructor: ",e.instructorName]})]})]}),e.course?.thumbnail&&(0,t.jsx)("img",{src:e.course.thumbnail,alt:e.courseName,className:"w-20 h-20 rounded-lg object-cover"})]}),(0,t.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600 mb-4",children:[(0,t.jsx)(h.Calendar,{className:"w-4 h-4"}),(0,t.jsxs)("span",{children:["Completed: ",new Date(e.completionDate).toLocaleDateString("vi-VN")]})]}),(0,t.jsxs)("div",{className:"flex gap-2 pt-4 border-t border-amber-200",children:[(0,t.jsxs)("button",{onClick:()=>{window.print()},className:"flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium",children:[(0,t.jsx)(m.Download,{className:"w-4 h-4"}),"Download PDF"]}),e.verificationUrl&&(0,t.jsxs)(x.default,{href:e.verificationUrl,target:"_blank",className:"flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium",children:[(0,t.jsx)(o.ExternalLink,{className:"w-4 h-4"}),"Verify"]})]})]})}var b=e.i(759727);function f(){let{user:e,loading:l}=(0,r.useAuth)(),d=(0,i.useRouter)();(0,a.useEffect)(()=>{l||e||d.push("/login?redirect=/lms/my-certificates")},[e,l,d]);let{data:m,loading:o,error:x}=(0,s.useQuery)(n,{skip:!e});if(l)return(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,t.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})});if(!e)return null;if(o)return(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,t.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,t.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})});if(x)return(0,t.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,t.jsxs)("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4 text-red-700",children:["Lỗi tải chứng chỉ: ",x.message]})});let f=m?.myCertificates||[],g=m?.certificateStats||{total:0,thisMonth:0,thisYear:0};return(0,t.jsx)("div",{className:"min-h-screen bg-gradient-to-b from-gray-50 to-white",children:(0,t.jsxs)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:[(0,t.jsxs)("div",{className:"flex items-center gap-3 mb-8",children:[(0,t.jsx)("div",{className:"p-3 bg-amber-100 rounded-xl",children:(0,t.jsx)(c.Award,{className:"w-10 h-10 text-amber-600"})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h1",{className:"text-4xl font-bold text-gray-900",children:"Chứng chỉ của tôi"}),(0,t.jsx)("p",{className:"text-gray-600 mt-1",children:"Các chứng chỉ hoàn thành khóa học bạn đã đạt được"})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",children:[(0,t.jsx)("div",{className:"bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-200",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-amber-600 font-medium mb-1",children:"Tổng số chứng chỉ"}),(0,t.jsx)("p",{className:"text-3xl font-bold text-amber-700",children:g.total})]}),(0,t.jsx)("div",{className:"p-3 bg-amber-100 rounded-lg",children:(0,t.jsx)(c.Award,{className:"w-8 h-8 text-amber-600"})})]})}),(0,t.jsx)("div",{className:"bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-200",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-blue-600 font-medium mb-1",children:"Tháng này"}),(0,t.jsx)("p",{className:"text-3xl font-bold text-blue-700",children:g.thisMonth})]}),(0,t.jsx)("div",{className:"p-3 bg-blue-100 rounded-lg",children:(0,t.jsx)(h.Calendar,{className:"w-8 h-8 text-blue-600"})})]})}),(0,t.jsx)("div",{className:"bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-200",children:(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-sm text-green-600 font-medium mb-1",children:"Năm nay"}),(0,t.jsx)("p",{className:"text-3xl font-bold text-green-700",children:g.thisYear})]}),(0,t.jsx)("div",{className:"p-3 bg-green-100 rounded-lg",children:(0,t.jsx)(b.TrendingUp,{className:"w-8 h-8 text-green-600"})})]})})]}),f.length>0?(0,t.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:f.map(e=>(0,t.jsx)(u,{certificate:e},e.id))}):(0,t.jsx)("div",{className:"bg-white rounded-xl shadow-md p-12 text-center",children:(0,t.jsxs)("div",{className:"max-w-md mx-auto",children:[(0,t.jsx)("div",{className:"p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center",children:(0,t.jsx)(c.Award,{className:"w-12 h-12 text-gray-400"})}),(0,t.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-2",children:"Chưa có chứng chỉ nào"}),(0,t.jsx)("p",{className:"text-gray-600 mb-6",children:"Hoàn thành khóa học để nhận chứng chỉ đầu tiên và thể hiện thành tích của bạn!"}),(0,t.jsx)("a",{href:"/lms/courses",className:"inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors",children:"Khám phá khóa học"})]})})]})})}e.s(["default",()=>f],638671)}]);