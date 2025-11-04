module.exports=[514596,a=>{"use strict";var b=a.i(321248),c=a.i(651332),d=a.i(168918),e=a.i(8912),f=a.i(772213),g=a.i(975780),h=a.i(202979),i=a.i(478184),j=a.i(293470),k=a.i(920283),l=a.i(144932),m=a.i(755820),n=a.i(629432),o=a.i(785903),p=a.i(79028),q=a.i(129853),r=a.i(508335),s=a.i(510071),t=a.i(300827),u=a.i(189101),v=a.i(509423),w=a.i(377194);let x=f.gql`
  query GetOrders($input: OrderFilterInput) {
    orders(input: $input) {
      items {
        id
        orderNumber
        status
        paymentStatus
        total
        shippingMethod
        createdAt
        user {
          id
          email
          profile {
            fullName
          }
        }
        guestEmail
        guestName
        items {
          id
          productName
          quantity
          price
        }
      }
      pagination {
        total
        page
        pageSize
        totalPages
        hasMore
      }
    }
  }
`,y=f.gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      success
      message
      order {
        id
        status
        paymentStatus
      }
    }
  }
`,z=f.gql`
  query GetOrderDetail($id: ID!) {
    order(id: $id) {
      id
      orderNumber
      status
      paymentStatus
      paymentMethod
      shippingMethod
      subtotal
      shippingFee
      tax
      discount
      total
      customerNote
      internalNote
      createdAt
      confirmedAt
      shippedAt
      deliveredAt
      cancelledAt
      user {
        email
        profile {
          fullName
          phone
        }
      }
      guestEmail
      guestName
      guestPhone
      shippingAddress
      billingAddress
      items {
        id
        productName
        variantName
        sku
        thumbnail
        quantity
        price
        subtotal
      }
      tracking {
        id
        status
        carrier
        trackingNumber
        trackingUrl
        estimatedDelivery
        actualDelivery
        events {
          id
          status
          description
          location
          eventTime
        }
      }
    }
  }
`,A={PENDING:{label:"Chờ xác nhận",color:"bg-yellow-100 text-yellow-800",icon:"⏳"},CONFIRMED:{label:"Đã xác nhận",color:"bg-blue-100 text-blue-800",icon:"✓"},PREPARING:{label:"Đang chuẩn bị",color:"bg-purple-100 text-purple-800",icon:"📦"},SHIPPING:{label:"Đang giao",color:"bg-indigo-100 text-indigo-800",icon:"🚚"},DELIVERED:{label:"Đã giao",color:"bg-green-100 text-green-800",icon:"✅"},CANCELLED:{label:"Đã hủy",color:"bg-red-100 text-red-800",icon:"❌"}},B={PENDING:{label:"Chưa thanh toán",color:"bg-gray-100 text-gray-800"},PROCESSING:{label:"Đang xử lý",color:"bg-blue-100 text-blue-800"},PAID:{label:"Đã thanh toán",color:"bg-green-100 text-green-800"},FAILED:{label:"Thất bại",color:"bg-red-100 text-red-800"},REFUNDED:{label:"Đã hoàn tiền",color:"bg-orange-100 text-orange-800"}};function C(){let[a,f]=(0,c.useState)({page:1,pageSize:20,status:void 0,search:void 0}),[m,z]=(0,c.useState)(""),[C,E]=(0,c.useState)(null),{data:F,loading:G,refetch:H}=(0,d.useQuery)(x,{variables:{input:a},fetchPolicy:"cache-and-network"}),[I]=(0,e.useMutation)(y,{onCompleted:a=>{a.updateOrderStatus.success?(u.toast.success(a.updateOrderStatus.message),H()):u.toast.error(a.updateOrderStatus.message)},onError:a=>{u.toast.error(`Lỗi: ${a.message}`)}}),J=()=>{f(a=>({...a,search:m||void 0,page:1}))},K=async(a,b)=>{await I({variables:{input:{orderId:a,status:b}}})},L=F?.orders?.items||[],M=F?.orders?.pagination||{};return(0,b.jsxs)("div",{className:"space-y-6",children:[(0,b.jsx)("div",{className:"flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4",children:(0,b.jsxs)("div",{children:[(0,b.jsx)("h1",{className:"text-3xl font-bold",children:"Quản Lý Đơn Hàng"}),(0,b.jsx)("p",{className:"text-gray-600 mt-1",children:"Quản lý và theo dõi tất cả đơn hàng"})]})}),(0,b.jsx)(g.Card,{children:(0,b.jsx)(g.CardContent,{className:"pt-6",children:(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(i.Input,{placeholder:"Tìm theo mã đơn, email, SĐT...",value:m,onChange:a=>z(a.target.value),onKeyPress:a=>"Enter"===a.key&&J()}),(0,b.jsx)(h.Button,{onClick:J,variant:"secondary",children:(0,b.jsx)(n.Search,{className:"w-4 h-4"})})]}),(0,b.jsxs)(l.Select,{value:a.status||"all",onValueChange:a=>f(b=>({...b,status:"all"===a?void 0:a,page:1})),children:[(0,b.jsx)(l.SelectTrigger,{children:(0,b.jsx)(l.SelectValue,{placeholder:"Trạng thái"})}),(0,b.jsxs)(l.SelectContent,{children:[(0,b.jsx)(l.SelectItem,{value:"all",children:"Tất cả"}),(0,b.jsx)(l.SelectItem,{value:"PENDING",children:"Chờ xác nhận"}),(0,b.jsx)(l.SelectItem,{value:"CONFIRMED",children:"Đã xác nhận"}),(0,b.jsx)(l.SelectItem,{value:"PREPARING",children:"Đang chuẩn bị"}),(0,b.jsx)(l.SelectItem,{value:"SHIPPING",children:"Đang giao"}),(0,b.jsx)(l.SelectItem,{value:"DELIVERED",children:"Đã giao"}),(0,b.jsx)(l.SelectItem,{value:"CANCELLED",children:"Đã hủy"})]})]}),(0,b.jsxs)(l.Select,{value:a.pageSize.toString(),onValueChange:a=>f(b=>({...b,pageSize:parseInt(a),page:1})),children:[(0,b.jsx)(l.SelectTrigger,{children:(0,b.jsx)(l.SelectValue,{})}),(0,b.jsxs)(l.SelectContent,{children:[(0,b.jsx)(l.SelectItem,{value:"10",children:"10 / trang"}),(0,b.jsx)(l.SelectItem,{value:"20",children:"20 / trang"}),(0,b.jsx)(l.SelectItem,{value:"50",children:"50 / trang"}),(0,b.jsx)(l.SelectItem,{value:"100",children:"100 / trang"})]})]})]})})}),(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsxs)(g.CardTitle,{children:["Danh Sách Đơn Hàng (",M.total||0,")"]})}),(0,b.jsx)(g.CardContent,{children:G?(0,b.jsx)("div",{className:"flex justify-center py-8",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"})}):0===L.length?(0,b.jsx)("div",{className:"text-center py-8 text-gray-500",children:"Không tìm thấy đơn hàng nào"}):(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)("div",{className:"overflow-x-auto",children:(0,b.jsxs)(k.Table,{children:[(0,b.jsx)(k.TableHeader,{children:(0,b.jsxs)(k.TableRow,{children:[(0,b.jsx)(k.TableHead,{children:"Mã đơn"}),(0,b.jsx)(k.TableHead,{children:"Khách hàng"}),(0,b.jsx)(k.TableHead,{children:"Sản phẩm"}),(0,b.jsx)(k.TableHead,{children:"Tổng tiền"}),(0,b.jsx)(k.TableHead,{children:"Trạng thái"}),(0,b.jsx)(k.TableHead,{children:"Thanh toán"}),(0,b.jsx)(k.TableHead,{children:"Thời gian"}),(0,b.jsx)(k.TableHead,{children:"Hành động"})]})}),(0,b.jsx)(k.TableBody,{children:L.map(a=>(0,b.jsxs)(k.TableRow,{children:[(0,b.jsx)(k.TableCell,{className:"font-mono font-semibold",children:a.orderNumber}),(0,b.jsx)(k.TableCell,{children:(0,b.jsxs)("div",{children:[(0,b.jsx)("div",{className:"font-medium",children:a.user?.profile?.fullName||a.guestName||"Khách"}),(0,b.jsx)("div",{className:"text-sm text-gray-500",children:a.user?.email||a.guestEmail})]})}),(0,b.jsx)(k.TableCell,{children:(0,b.jsxs)("div",{className:"text-sm",children:[a.items.length," sản phẩm"]})}),(0,b.jsxs)(k.TableCell,{className:"font-semibold",children:[a.total.toLocaleString("vi-VN"),"₫"]}),(0,b.jsx)(k.TableCell,{children:(0,b.jsxs)(j.Badge,{className:A[a.status].color,children:[A[a.status].icon," ",A[a.status].label]})}),(0,b.jsx)(k.TableCell,{children:(0,b.jsx)(j.Badge,{className:B[a.paymentStatus].color,children:B[a.paymentStatus].label})}),(0,b.jsx)(k.TableCell,{className:"text-sm text-gray-500",children:(0,v.formatDistanceToNow)(new Date(a.createdAt),{addSuffix:!0,locale:w.vi})}),(0,b.jsx)(k.TableCell,{children:(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsx)(h.Button,{size:"sm",variant:"outline",onClick:()=>E(a.id),children:(0,b.jsx)(o.Eye,{className:"w-4 h-4"})}),"PENDING"===a.status&&(0,b.jsx)(h.Button,{size:"sm",onClick:()=>K(a.id,"CONFIRMED"),children:(0,b.jsx)(r.CheckCircle,{className:"w-4 h-4"})}),"CONFIRMED"===a.status&&(0,b.jsx)(h.Button,{size:"sm",onClick:()=>K(a.id,"PREPARING"),children:(0,b.jsx)(p.Package,{className:"w-4 h-4"})}),"PREPARING"===a.status&&(0,b.jsx)(h.Button,{size:"sm",onClick:()=>K(a.id,"SHIPPING"),children:(0,b.jsx)(q.Truck,{className:"w-4 h-4"})})]})})]},a.id))})]})}),M.totalPages>1&&(0,b.jsxs)("div",{className:"flex justify-between items-center mt-4",children:[(0,b.jsxs)("div",{className:"text-sm text-gray-600",children:["Trang ",M.page," / ",M.totalPages]}),(0,b.jsxs)("div",{className:"flex gap-2",children:[(0,b.jsxs)(h.Button,{variant:"outline",size:"sm",disabled:1===M.page,onClick:()=>f(a=>({...a,page:a.page-1})),children:[(0,b.jsx)(s.ChevronLeft,{className:"w-4 h-4"}),"Trước"]}),(0,b.jsxs)(h.Button,{variant:"outline",size:"sm",disabled:!M.hasMore,onClick:()=>f(a=>({...a,page:a.page+1})),children:["Sau",(0,b.jsx)(t.ChevronRight,{className:"w-4 h-4"})]})]})]})]})})]}),C&&(0,b.jsx)(D,{orderId:C,open:!!C,onClose:()=>E(null),onStatusUpdate:K})]})}function D({orderId:a,open:c,onClose:e,onStatusUpdate:f}){let{data:i,loading:j}=(0,d.useQuery)(z,{variables:{id:a},skip:!a}),k=i?.order;if(j)return(0,b.jsx)(m.Dialog,{open:c,onOpenChange:e,children:(0,b.jsx)(m.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:(0,b.jsx)("div",{className:"flex justify-center py-8",children:(0,b.jsx)("div",{className:"animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"})})})});if(!k)return null;let l=k.shippingAddress||{};return k.billingAddress,(0,b.jsx)(m.Dialog,{open:c,onOpenChange:e,children:(0,b.jsxs)(m.DialogContent,{className:"max-w-4xl max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)(m.DialogHeader,{children:[(0,b.jsxs)(m.DialogTitle,{className:"text-2xl",children:["Chi Tiết Đơn Hàng #",k.orderNumber]}),(0,b.jsxs)(m.DialogDescription,{children:["Đặt hàng ",(0,v.formatDistanceToNow)(new Date(k.createdAt),{addSuffix:!0,locale:w.vi})]})]}),(0,b.jsxs)("div",{className:"space-y-6 mt-4",children:[(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Cập Nhật Trạng Thái"})}),(0,b.jsx)(g.CardContent,{children:(0,b.jsx)("div",{className:"flex flex-wrap gap-2",children:["PENDING","CONFIRMED","PREPARING","SHIPPING","DELIVERED","CANCELLED"].map(c=>(0,b.jsxs)(h.Button,{variant:k.status===c?"default":"outline",onClick:()=>{f(a,c),e()},disabled:k.status===c,children:[A[c].icon," ",A[c].label]},c))})})]}),(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Thông Tin Khách Hàng"})}),(0,b.jsx)(g.CardContent,{children:(0,b.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Tên"}),(0,b.jsx)("p",{className:"font-medium",children:k.user?.profile?.fullName||k.guestName})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Email"}),(0,b.jsx)("p",{className:"font-medium",children:k.user?.email||k.guestEmail})]}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Số điện thoại"}),(0,b.jsx)("p",{className:"font-medium",children:k.user?.profile?.phone||k.guestPhone})]})]})})]}),(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Địa Chỉ Giao Hàng"})}),(0,b.jsxs)(g.CardContent,{children:[(0,b.jsx)("p",{children:l.fullName}),(0,b.jsx)("p",{children:l.phone}),(0,b.jsx)("p",{children:l.address}),(0,b.jsxs)("p",{children:[l.ward,", ",l.district,", ",l.city]})]})]}),(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Sản Phẩm"})}),(0,b.jsx)(g.CardContent,{children:(0,b.jsx)("div",{className:"space-y-3",children:k.items.map(a=>(0,b.jsxs)("div",{className:"flex gap-4 p-3 border rounded-lg",children:[a.thumbnail&&(0,b.jsx)("img",{src:a.thumbnail,alt:a.productName,className:"w-16 h-16 object-cover rounded"}),(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium",children:a.productName}),a.variantName&&(0,b.jsx)("p",{className:"text-sm text-gray-600",children:a.variantName}),(0,b.jsxs)("p",{className:"text-sm text-gray-600",children:["SKU: ",a.sku]})]}),(0,b.jsxs)("div",{className:"text-right",children:[(0,b.jsxs)("p",{className:"font-medium",children:[a.price.toLocaleString("vi-VN"),"₫"]}),(0,b.jsxs)("p",{className:"text-sm text-gray-600",children:["x",a.quantity]}),(0,b.jsxs)("p",{className:"font-semibold text-blue-600",children:[a.subtotal.toLocaleString("vi-VN"),"₫"]})]})]},a.id))})})]}),(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Tổng Kết"})}),(0,b.jsx)(g.CardContent,{children:(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsxs)("div",{className:"flex justify-between",children:[(0,b.jsx)("span",{children:"Tạm tính:"}),(0,b.jsxs)("span",{children:[k.subtotal.toLocaleString("vi-VN"),"₫"]})]}),(0,b.jsxs)("div",{className:"flex justify-between",children:[(0,b.jsx)("span",{children:"Phí vận chuyển:"}),(0,b.jsxs)("span",{children:[k.shippingFee.toLocaleString("vi-VN"),"₫"]})]}),k.discount>0&&(0,b.jsxs)("div",{className:"flex justify-between text-green-600",children:[(0,b.jsx)("span",{children:"Giảm giá:"}),(0,b.jsxs)("span",{children:["-",k.discount.toLocaleString("vi-VN"),"₫"]})]}),k.tax>0&&(0,b.jsxs)("div",{className:"flex justify-between",children:[(0,b.jsx)("span",{children:"Thuế:"}),(0,b.jsxs)("span",{children:[k.tax.toLocaleString("vi-VN"),"₫"]})]}),(0,b.jsxs)("div",{className:"flex justify-between text-xl font-bold border-t pt-2",children:[(0,b.jsx)("span",{children:"Tổng cộng:"}),(0,b.jsxs)("span",{className:"text-blue-600",children:[k.total.toLocaleString("vi-VN"),"₫"]})]})]})})]}),k.tracking&&(0,b.jsxs)(g.Card,{children:[(0,b.jsx)(g.CardHeader,{children:(0,b.jsx)(g.CardTitle,{className:"text-lg",children:"Theo Dõi Đơn Hàng"})}),(0,b.jsx)(g.CardContent,{children:(0,b.jsxs)("div",{className:"space-y-3",children:[k.tracking.carrier&&(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Đơn vị vận chuyển"}),(0,b.jsx)("p",{className:"font-medium",children:k.tracking.carrier})]}),k.tracking.trackingNumber&&(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm text-gray-600",children:"Mã vận đơn"}),(0,b.jsx)("p",{className:"font-mono font-medium",children:k.tracking.trackingNumber})]}),k.tracking.events&&k.tracking.events.length>0&&(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("p",{className:"text-sm text-gray-600 font-semibold",children:"Lịch sử di chuyển"}),k.tracking.events.map(a=>(0,b.jsxs)("div",{className:"flex gap-3 p-2 border-l-2 border-blue-500 pl-3",children:[(0,b.jsxs)("div",{className:"flex-1",children:[(0,b.jsx)("p",{className:"font-medium",children:a.description}),a.location&&(0,b.jsx)("p",{className:"text-sm text-gray-600",children:a.location})]}),(0,b.jsx)("div",{className:"text-sm text-gray-500",children:(0,v.formatDistanceToNow)(new Date(a.eventTime),{addSuffix:!0,locale:w.vi})})]},a.id))]})]})})]})]})]})})}a.s(["default",()=>C])}];

//# sourceMappingURL=frontend_src_app_admin_orders_page_tsx_d185f780._.js.map