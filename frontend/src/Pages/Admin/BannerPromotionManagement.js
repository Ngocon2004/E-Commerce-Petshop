import React, { useState } from 'react';
import { FiImage, FiGift } from 'react-icons/fi';
import { AdminPageHeader } from '../../components/Admin';
import BannerManagement from '../../Compoments/Admin/BannerManagement';
import PromotionManagement from '../../Compoments/Admin/PromotionManagement';

const BannerPromotionManagement = () => {
  const [activeTab, setActiveTab] = useState('banners');

  return (
    <div>
      <AdminPageHeader title="Quản lý Banners">
        {/* Tab Navigation */}
        <div className="d-flex border-bottom mb-4">
          <button
            type="button"
            className={`custom-tab-button ${
              activeTab === 'banners' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('banners')}
          >
            Quản lý Banners
          </button>
          {/* <button
            type="button"
            className={`custom-tab-button ${
              activeTab === 'promotions' ? 'active' : ''
            }`}
            onClick={() => setActiveTab('promotions')}
          >
            Quản lý Khuyến Mãi
          </button> */}
        </div>
      </AdminPageHeader>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'banners' && <BannerManagement />}
        {activeTab === 'promotions' && <PromotionManagement />}
      </div>
    </div>
  );
};

export default BannerPromotionManagement;
