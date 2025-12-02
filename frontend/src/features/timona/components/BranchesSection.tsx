'use client';

import { useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../graphql/queries';
import type { Branch } from '../types';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

interface BranchCardProps {
  branch: Branch;
}

function BranchCard({ branch }: BranchCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Branch Image */}
      {branch.featuredImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={branch.featuredImage}
            alt={branch.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      {/* Branch Info */}
      <div className="p-6">
        {/* Featured Badge */}
        {branch.isFeatured && (
          <span className="inline-block bg-[#00256e] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
            TRỤ SỞ CHÍNH
          </span>
        )}

        <h3 className="text-xl font-bold text-[#00256e] mb-4">{branch.name}</h3>

        {branch.shortDescription && (
          <p className="text-gray-600 text-sm mb-4">{branch.shortDescription}</p>
        )}

        <div className="space-y-3">
          {/* Address */}
          {branch.address && (
            <div className="flex items-start gap-3 text-gray-600">
              <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#00256e]" />
              <span className="text-sm">{branch.address}</span>
            </div>
          )}

          {/* Phone */}
          {branch.phone && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 flex-shrink-0 text-[#00256e]" />
              <a href={`tel:${branch.phone}`} className="text-sm hover:text-[#00256e] transition">
                {branch.phone}
              </a>
            </div>
          )}

          {/* Hotline */}
          {branch.hotline && (
            <div className="flex items-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 flex-shrink-0 text-green-600" />
              <a href={`tel:${branch.hotline}`} className="text-sm font-bold text-green-600 hover:text-green-700 transition">
                Hotline: {branch.hotline}
              </a>
            </div>
          )}

          {/* Email */}
          {branch.email && (
            <div className="flex items-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 flex-shrink-0 text-[#00256e]" />
              <a href={`mailto:${branch.email}`} className="text-sm hover:text-[#00256e] transition">
                {branch.email}
              </a>
            </div>
          )}

          {/* Working Hours */}
          {branch.workingHours && (
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-5 h-5 flex-shrink-0 text-[#00256e]" />
              <span className="text-sm">{branch.workingHours}</span>
            </div>
          )}
        </div>

        {/* Map Embed */}
        {branch.mapEmbedUrl && (
          <div className="mt-4">
            <iframe
              src={branch.mapEmbedUrl}
              width="100%"
              height="150"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function BranchesSection() {
  const { data, loading, error } = useQuery(GET_BRANCHES, {
    variables: { isActive: true },
  });

  const branches: Branch[] = data?.branches || [];

  // Sort to show featured branch first, then by displayOrder
  const sortedBranches = [...branches].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return a.displayOrder - b.displayOrder;
  });

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <div className="relative inline-block mb-6">
            <div className="bg-[#00256e] text-white px-8 py-4 text-2xl md:text-3xl font-bold uppercase relative">
              HỆ THỐNG CHI NHÁNH
              <div className="absolute right-0 top-0 w-0 h-0 border-t-[56px] border-t-[#00256e] border-r-[40px] border-r-transparent translate-x-full"></div>
            </div>
          </div>

          <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto">
            Timona Academy hiện có mặt tại nhiều tỉnh thành trên cả nước, sẵn sàng đồng hành cùng bạn
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00256e] border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500">Có lỗi xảy ra khi tải dữ liệu.</p>
          </div>
        )}

        {/* Branches Grid */}
        {!loading && !error && sortedBranches.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedBranches.map((branch) => (
              <BranchCard key={branch.id} branch={branch} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && branches.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Chưa có thông tin chi nhánh.</p>
          </div>
        )}
      </div>
    </section>
  );
}
