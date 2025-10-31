import React from 'react';
import {
  FaPaw,
  FaHeart,
  FaShieldAlt,
  FaTruck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const About = () => {
  return (
    <div className="container my-5">
      {/* Hero Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="text-center">
            <h1 className="display-4 mb-4">
              <FaPaw className="text-primary me-3" />
              Về Chúng Tôi
            </h1>
            <p className="lead text-muted">
              Chăm sóc thú cưng với tình yêu và sự tận tâm
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="row mb-5">
        <div className="col-lg-6">
          <h2 className="mb-4">Sứ Mệnh Của Chúng Tôi</h2>
          <p className="lead">
            Tại PetShop, chúng tôi tin rằng mỗi thú cưng đều xứng đáng được chăm
            sóc tốt nhất. Chúng tôi cam kết mang đến những sản phẩm chất lượng
            cao và dịch vụ tận tâm để đảm bảo thú cưng của bạn luôn khỏe mạnh và
            hạnh phúc.
          </p>
          <p>
            Với hơn 5 năm kinh nghiệm trong lĩnh vực chăm sóc thú cưng, chúng
            tôi hiểu rõ nhu cầu đặc biệt của từng loài thú cưng và luôn cập nhật
            những xu hướng mới nhất trong ngành.
          </p>
        </div>
        <div className="col-lg-6">
          <div className="text-center">
            <img
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              alt="Pet care"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-5">Giá Trị Cốt Lõi</h2>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card h-100 text-center border-0 shadow-sm">
            <div className="card-body">
              <FaHeart className="text-danger display-4 mb-3" />
              <h5 className="card-title">Tình Yêu Thương</h5>
              <p className="card-text">
                Chúng tôi yêu thương và tôn trọng mọi loài thú cưng, luôn đặt
                sức khỏe và hạnh phúc của chúng lên hàng đầu.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card h-100 text-center border-0 shadow-sm">
            <div className="card-body">
              <FaShieldAlt className="text-success display-4 mb-3" />
              <h5 className="card-title">Chất Lượng Đảm Bảo</h5>
              <p className="card-text">
                Tất cả sản phẩm đều được kiểm định nghiêm ngặt, đảm bảo an toàn
                tuyệt đối cho thú cưng của bạn.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-4 mb-4">
          <div className="card h-100 text-center border-0 shadow-sm">
            <div className="card-body">
              <FaTruck className="text-primary display-4 mb-3" />
              <h5 className="card-title">Dịch Vụ Tận Tâm</h5>
              <p className="card-text">
                Giao hàng nhanh chóng, tư vấn chuyên nghiệp và hỗ trợ 24/7 để
                đáp ứng mọi nhu cầu của bạn.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="row mb-5">
        <div className="col-12">
          <h2 className="text-center mb-5">Đội Ngũ Chuyên Nghiệp</h2>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card text-center border-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              alt="Dr. Sarah"
            />
            <div className="card-body">
              <h5 className="card-title">Dr. Sarah Johnson</h5>
              <p className="text-muted">Bác sĩ thú y chính</p>
              <p className="card-text small">
                Chuyên gia với 10 năm kinh nghiệm trong chăm sóc thú cưng
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card text-center border-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              alt="Mike Chen"
            />
            <div className="card-body">
              <h5 className="card-title">Mike Chen</h5>
              <p className="text-muted">Chuyên gia dinh dưỡng</p>
              <p className="card-text small">
                Tư vấn chế độ ăn uống phù hợp cho từng loài thú cưng
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card text-center border-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              alt="Emma Wilson"
            />
            <div className="card-body">
              <h5 className="card-title">Emma Wilson</h5>
              <p className="text-muted">Chuyên viên chăm sóc</p>
              <p className="card-text small">
                Hướng dẫn chăm sóc và huấn luyện thú cưng
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6 mb-4">
          <div className="card text-center border-0 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
              className="card-img-top rounded-circle mx-auto mt-3"
              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
              alt="Lisa Brown"
            />
            <div className="card-body">
              <h5 className="card-title">Lisa Brown</h5>
              <p className="text-muted">Tư vấn sản phẩm</p>
              <p className="card-text small">
                Giúp bạn chọn sản phẩm phù hợp nhất cho thú cưng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="bg-primary text-white rounded p-5 text-center">
            <h3 className="mb-4">Thành Tựu Của Chúng Tôi</h3>
            <div className="row">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="display-4 fw-bold">10,000+</div>
                <p className="mb-0">Khách hàng tin tưởng</p>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="display-4 fw-bold">50,000+</div>
                <p className="mb-0">Sản phẩm đã bán</p>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="display-4 fw-bold">5+</div>
                <p className="mb-0">Năm kinh nghiệm</p>
              </div>
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="display-4 fw-bold">99%</div>
                <p className="mb-0">Khách hàng hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-5">
              <h3 className="mb-4">Liên Hệ Với Chúng Tôi</h3>
              <p className="lead mb-4">
                Bạn có câu hỏi hoặc cần tư vấn? Chúng tôi luôn sẵn sàng hỗ trợ!
              </p>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <FaPhone className="text-primary display-6 mb-2" />
                  <h5>Hotline</h5>
                  <p className="text-muted">1900 1234 567</p>
                </div>
                <div className="col-md-4 mb-3">
                  <FaEnvelope className="text-primary display-6 mb-2" />
                  <h5>Email</h5>
                  <p className="text-muted">info@petshop.com</p>
                </div>
                <div className="col-md-4 mb-3">
                  <FaMapMarkerAlt className="text-primary display-6 mb-2" />
                  <h5>Địa Chỉ</h5>
                  <p className="text-muted">123 Đường ABC, Quận 1, TP.HCM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
