import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createInstructor() {
  try {
    // Thông tin giảng viên
    const instructorData = {
      username: 'giangvien01',      // Thay đổi tên đăng nhập
      email: 'giangvien01@example.com', // Thay đổi email
      password: '123456',            // Thay đổi mật khẩu
      phone: '0912345678',          // Tùy chọn
      firstName: 'Nguyễn Văn',      // Tùy chọn
      lastName: 'A',                // Tùy chọn
      roleType: 'GIANGVIEN',        // Cố định
      isActive: true,               // Kích hoạt tài khoản
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(instructorData.password, 10);

    // Tạo giảng viên
    const instructor = await prisma.user.create({
      data: {
        username: instructorData.username,
        email: instructorData.email,
        password: hashedPassword,
        phone: instructorData.phone,
        firstName: instructorData.firstName,
        lastName: instructorData.lastName,
        roleType: instructorData.roleType as any,
        isActive: instructorData.isActive,
        isVerified: true, // Auto verify
      },
    });

    console.log('✅ Đã tạo giảng viên thành công!');
    console.log('📋 Thông tin:');
    console.log('   - ID:', instructor.id);
    console.log('   - Username:', instructor.username);
    console.log('   - Email:', instructor.email);
    console.log('   - Họ tên:', `${instructor.firstName} ${instructor.lastName}`);
    console.log('   - Vai trò:', instructor.roleType);
    console.log('   - Trạng thái:', instructor.isActive ? 'Kích hoạt' : 'Vô hiệu hóa');
    console.log('\n🔑 Đăng nhập với:');
    console.log('   - Username:', instructor.username);
    console.log('   - Password:', instructorData.password);

  } catch (error: any) {
    console.error('❌ Lỗi:', error.message);
    
    if (error.code === 'P2002') {
      console.error('💡 Username hoặc Email đã tồn tại, vui lòng thay đổi!');
    }
  } finally {
    await prisma.$disconnect();
  }
}

createInstructor();
