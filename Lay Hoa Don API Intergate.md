frontend listhoadon

enpoint
banra :  https://hoadondientu.gdt.gov.vn:30000/query/invoices/sold?sort=tdlap:desc,khmshdon:asc,shdon:desc&size=50&search=tdlap=ge=27/08/2025T00:00:00;tdlap=le=26/09/2025T23:59:59
muavao : https://hoadondientu.gdt.gov.vn:30000/query/invoices/purchase?sort=tdlap:desc,khmshdon:asc,shdon:desc&size=50&search=tdlap=ge=27/08/2025T00:00:00;tdlap=le=26/09/2025T23:59:59


prisma model ext_listhoadon
gồm các column : id,nbmst,khmshdon,khhdon,shdon,cqt,hdon,hthdon,htttoan,idtbao,khdon,khhdgoc,khmshdgoc,lhdgoc,mhdon,mtdiep,mtdtchieu,nbdchi,chma,chten,nbhdktngay,nbhdktso,nbhdso,nblddnbo,nbptvchuyen,nbstkhoan,nbten,nbtnhang,nbtnvchuyen,ncma,ncnhat,ngcnhat,nky,nmdchi,nmmst,nmstkhoan,nmten,nmtnhang,nmtnmua,nmttkhac,ntao,ntnhan,pban,ptgui,shdgoc,tchat,tdlap,tgia,tgtcthue,tgtthue,tgtttbchu,tgtttbso,thdon,thlap,thttlphi,tlhdon,ttcktmai,tthai,tttbao,ttxly,tvandnkntt,mhso,ladhddt,mkhang,nbsdthoai,nbdctdtu,nbfax,nbwebsite,nmsdthoai,nmdctdtu,nmcmnd,nmcks,bhphap,hddunlap,gchdgoc,tbhgtngay,bhpldo,bhpcbo,bhpngay,tdlhdgoc,tgtphi,unhiem,mstdvnunlhdon,tdvnunlhdon,nbmdvqhnsach,nbsqdinh,nbncqdinh,nbcqcqdinh,nbhtban,nmmdvqhnsach,nmddvchden,nmtgvchdtu,nmtgvchdden,nbtnban,dcdvnunlhdon,dksbke,dknlbke,thtttoan,msttcgp,gchu,kqcht,hdntgia,tgtkcthue,tgtkhac,nmshchieu,nmnchchieu,nmnhhhchieu,nmqtich,ktkhthue,nmstttoan,nmttttoan,hdhhdvu,qrcode,ttmstten,ladhddtten,hdxkhau,hdxkptquan,hdgktkhthue,hdonLquans,tthdclquan,pdndungs,hdtbssrses,hdTrung,isHDTrung,hdcttchinh

prisma model ext_detailhoadon
gồm các column : id,idhdon,dgia,dvtinh,ltsuat,sluong,stbchu,stckhau,stt,tchat,ten,thtcthue,thtien,tlckhau,tsuat,tthue,sxep,dvtte,tgia,tthhdtrung

frontend detailhoadon
enpoint
chitiet : https://hoadondientu.gdt.gov.vn:30000/query/invoices/detail?nbmst=0304475742&khhdon=C25TVP&shdon=53271&khmshdon=1


cập nhật code ketoan/listhoadon
xuất excel với lựa chọn thời gian từ ngày đến ngày.
lấy dữ liệu từ database ext_listhoadon kết hợp ext_detailhoadon
dữ liệu excel xuất ra sẽ có cấu trúc 

ext_listhoadon.shdon
ext_listhoadon.nbten
ext_listhoadon.nmten
ext_listhoadon.ntao
ext_listhoadon.tdlap
ext_listhoadon.tgtcthue
ext_listhoadon.tgtthue
ext_listhoadon.tgtttbso
ext_listhoadon.tgtttbso
ext_listhoadon.thlap
ext_listhoadon.ttxly

ext_detailhoadon.ten
ext_detailhoadon.dvtinh
ext_detailhoadon.sluong
ext_detailhoadon.dgia
ext_detailhoadon.thtien
ext_detailhoadon.tsuat


