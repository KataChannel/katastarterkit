module.exports=[57597,659384,a=>{"use strict";let b=(0,a.i(367990).default)("trending-up",[["path",{d:"M16 7h6v6",key:"box55l"}],["path",{d:"m22 7-8.5 8.5-5-5L2 17",key:"1t1m79"}]]);a.s(["default",()=>b],659384),a.s(["TrendingUp",()=>b],57597)},722112,a=>{"use strict";let b=(0,a.i(367990).default)("calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]]);a.s(["default",()=>b])},128348,a=>{"use strict";var b=a.i(722112);a.s(["Calendar",()=>b.default])},648996,a=>{"use strict";let b=(0,a.i(367990).default)("download",[["path",{d:"M12 15V3",key:"m9g1x1"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["path",{d:"m7 10 5 5 5-5",key:"brsn70"}]]);a.s(["default",()=>b])},515678,a=>{"use strict";var b=a.i(648996);a.s(["Download",()=>b.default])},938870,a=>{"use strict";let b=(0,a.i(367990).default)("external-link",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);a.s(["default",()=>b])},12979,a=>{"use strict";var b=a.i(938870);a.s(["ExternalLink",()=>b.default])},510368,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(40947),f=a.i(53627),g=a.i(772213);let h=g.gql`
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
`,i=g.gql`
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
  ${h}
`;g.gql`
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
  ${h}
`,g.gql`
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
  ${h}
`,g.gql`
  mutation GenerateCertificate($enrollmentId: ID!) {
    generateCertificate(enrollmentId: $enrollmentId) {
      ...CertificateData
    }
  }
  ${h}
`;var j=a.i(147678),k=a.i(515678),l=a.i(12979),m=a.i(128348),n=a.i(439889);function o({certificate:a}){return(0,b.jsxs)("div",{className:"bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-amber-200 hover:shadow-xl transition-all",children:[(0,b.jsxs)("div",{className:"flex items-start justify-between mb-4",children:[(0,b.jsxs)("div",{className:"flex items-start gap-4",children:[(0,b.jsx)("div",{className:"p-3 bg-amber-100 rounded-lg",children:(0,b.jsx)(j.Award,{className:"w-10 h-10 text-amber-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-1",children:a.courseName}),(0,b.jsxs)("p",{className:"text-sm text-gray-600 font-mono",children:["#",a.certificateNumber]}),(0,b.jsxs)("p",{className:"text-sm text-gray-500 mt-2",children:["Instructor: ",a.instructorName]})]})]}),a.course?.thumbnail&&(0,b.jsx)("img",{src:a.course.thumbnail,alt:a.courseName,className:"w-20 h-20 rounded-lg object-cover"})]}),(0,b.jsxs)("div",{className:"flex items-center gap-2 text-sm text-gray-600 mb-4",children:[(0,b.jsx)(m.Calendar,{className:"w-4 h-4"}),(0,b.jsxs)("span",{children:["Completed: ",new Date(a.completionDate).toLocaleDateString("vi-VN")]})]}),(0,b.jsxs)("div",{className:"flex gap-2 pt-4 border-t border-amber-200",children:[(0,b.jsxs)("button",{onClick:()=>{window.print()},className:"flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium",children:[(0,b.jsx)(k.Download,{className:"w-4 h-4"}),"Download PDF"]}),a.verificationUrl&&(0,b.jsxs)(n.default,{href:a.verificationUrl,target:"_blank",className:"flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-amber-600 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors font-medium",children:[(0,b.jsx)(l.ExternalLink,{className:"w-4 h-4"}),"Verify"]})]})]})}var p=a.i(57597);function q(){let{user:a,loading:g}=(0,e.useAuth)(),h=(0,f.useRouter)();(0,c.useEffect)(()=>{g||a||h.push("/login?redirect=/lms/my-certificates")},[a,g,h]);let{data:k,loading:l,error:n}=(0,d.useQuery)(i,{skip:!a});if(g)return(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,b.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})});if(!a)return null;if(l)return(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,b.jsx)("div",{className:"flex items-center justify-center h-64",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"})})});if(n)return(0,b.jsx)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:(0,b.jsxs)("div",{className:"bg-red-50 border border-red-200 rounded-lg p-4 text-red-700",children:["Lỗi tải chứng chỉ: ",n.message]})});let q=k?.myCertificates||[],r=k?.certificateStats||{total:0,thisMonth:0,thisYear:0};return(0,b.jsx)("div",{className:"min-h-screen bg-gradient-to-b from-gray-50 to-white",children:(0,b.jsxs)("div",{className:"max-w-7xl mx-auto px-4 py-8",children:[(0,b.jsxs)("div",{className:"flex items-center gap-3 mb-8",children:[(0,b.jsx)("div",{className:"p-3 bg-amber-100 rounded-xl",children:(0,b.jsx)(j.Award,{className:"w-10 h-10 text-amber-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-4xl font-bold text-gray-900",children:"Chứng chỉ của tôi"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Các chứng chỉ hoàn thành khóa học bạn đã đạt được"})]})]}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",children:[(0,b.jsx)("div",{className:"bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-md border border-amber-200",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-amber-600 font-medium mb-1",children:"Tổng số chứng chỉ"}),(0,b.jsx)("p",{className:"text-3xl font-bold text-amber-700",children:r.total})]}),(0,b.jsx)("div",{className:"p-3 bg-amber-100 rounded-lg",children:(0,b.jsx)(j.Award,{className:"w-8 h-8 text-amber-600"})})]})}),(0,b.jsx)("div",{className:"bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-md border border-blue-200",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-blue-600 font-medium mb-1",children:"Tháng này"}),(0,b.jsx)("p",{className:"text-3xl font-bold text-blue-700",children:r.thisMonth})]}),(0,b.jsx)("div",{className:"p-3 bg-blue-100 rounded-lg",children:(0,b.jsx)(m.Calendar,{className:"w-8 h-8 text-blue-600"})})]})}),(0,b.jsx)("div",{className:"bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-md border border-green-200",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-green-600 font-medium mb-1",children:"Năm nay"}),(0,b.jsx)("p",{className:"text-3xl font-bold text-green-700",children:r.thisYear})]}),(0,b.jsx)("div",{className:"p-3 bg-green-100 rounded-lg",children:(0,b.jsx)(p.TrendingUp,{className:"w-8 h-8 text-green-600"})})]})})]}),q.length>0?(0,b.jsx)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:q.map(a=>(0,b.jsx)(o,{certificate:a},a.id))}):(0,b.jsx)("div",{className:"bg-white rounded-xl shadow-md p-12 text-center",children:(0,b.jsxs)("div",{className:"max-w-md mx-auto",children:[(0,b.jsx)("div",{className:"p-4 bg-gray-100 rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center",children:(0,b.jsx)(j.Award,{className:"w-12 h-12 text-gray-400"})}),(0,b.jsx)("h3",{className:"text-xl font-bold text-gray-900 mb-2",children:"Chưa có chứng chỉ nào"}),(0,b.jsx)("p",{className:"text-gray-600 mb-6",children:"Hoàn thành khóa học để nhận chứng chỉ đầu tiên và thể hiện thành tích của bạn!"}),(0,b.jsx)("a",{href:"/lms/courses",className:"inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors",children:"Khám phá khóa học"})]})})]})})}a.s(["default",()=>q],510368)}];

//# sourceMappingURL=_e1ac9471._.js.map