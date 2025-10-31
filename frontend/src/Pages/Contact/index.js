import React, { useState } from 'react';
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaWhatsapp,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Simulate form submission
    toast.success(
      'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong vòng 24h.'
    );

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="container my-5">
      {/* Header */}
      <div className="row mb-5">
        <div className="col-12 text-center">
          <h1 className="display-4 mb-3">Liên Hệ Với Chúng Tôi</h1>
          <p className="lead text-muted">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </p>
        </div>
      </div>

      <div className="row">
        {/* Contact Information */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h4 className="mb-4">Thông Tin Liên Hệ</h4>

              {/* Phone */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle p-3 me-3 mr-2">
                  <FaPhone />
                </div>
                <div>
                  <h6 className="mb-1">Điện Thoại</h6>
                  <p className="text-muted mb-0">1900 1234 567</p>
                  <small className="text-muted">Hotline: 24/7</small>
                </div>
              </div>

              {/* Email */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-success text-white rounded-circle p-3 me-3 mr-2">
                  <FaEnvelope />
                </div>
                <div>
                  <h6 className="mb-1">Email</h6>
                  <p className="text-muted mb-0">info@petshop.com</p>
                  <small className="text-muted">Phản hồi trong 24h</small>
                </div>
              </div>

              {/* Address */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-warning text-white rounded-circle p-3 me-3 mr-2">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h6 className="mb-1">Địa Chỉ</h6>
                  <p className="text-muted mb-0">
                    123 Đường ABC, Phường 1<br />
                    Quận 1, TP. Hồ Chí Minh
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="d-flex align-items-center mb-4">
                <div className="bg-info text-white rounded-circle p-3 me-3 mr-2">
                  <FaClock />
                </div>
                <div>
                  <h6 className="mb-1">Giờ Làm Việc</h6>
                  <p className="text-muted mb-0">
                    Thứ 2 - Thứ 6: 8:00 - 18:00
                    <br />
                    Thứ 7: 8:00 - 16:00
                    <br />
                    Chủ nhật: Nghỉ
                  </p>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-4">
                <h6 className="mb-3">Theo Dõi Chúng Tôi</h6>
                <div className="d-flex gap-3 mr-2">
                  <a href="#" className="text-primary fs-4 mr-2">
                    <FaFacebook />
                  </a>
                  <a href="#" className="text-danger fs-4 mr-2">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-info fs-4 mr-2">
                    <FaTwitter />
                  </a>
                  <a href="#" className="text-danger fs-4 mr-2">
                    <FaYoutube />
                  </a>
                  <a href="#" className="text-success fs-4 mr-2">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        {/* <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4">Gửi Tin Nhắn Cho Chúng Tôi</h4>

              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Họ và Tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Số Điện Thoại
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="subject" className="form-label">
                      Chủ Đề
                    </label>
                    <select
                      className="form-select"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="product">Hỏi về sản phẩm</option>
                      <option value="order">Hỏi về đơn hàng</option>
                      <option value="shipping">Hỏi về giao hàng</option>
                      <option value="return">Đổi trả sản phẩm</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Nội Dung Tin Nhắn <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Hãy mô tả chi tiết câu hỏi hoặc vấn đề của bạn..."
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Gửi Tin Nhắn
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div> */}

        <div className="col-8 ">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-0">
              <h4 className="p-4 mb-0">Vị Trí Cửa Hàng</h4>
              <div className="bg-light p-5 text-center">
                <FaMapMarkerAlt className="text-primary display-1 mb-3" />
                <h5>123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh</h5>
                <p className="text-muted mb-4">
                  Cửa hàng mở cửa từ Thứ 2 đến Thứ 6 (8:00 - 18:00), Thứ 7 (8:00
                  - 16:00)
                </p>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-primary">🚗 Bãi Đỗ Xe</h6>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-success">🚌 Gần Trạm Xe Buýt</h6>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-info">🚇 Gần Metro</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {/* <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <h4 className="p-4 mb-0">Vị Trí Cửa Hàng</h4>
              <div className="bg-light p-5 text-center">
                <FaMapMarkerAlt className="text-primary display-1 mb-3" />
                <h5>123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh</h5>
                <p className="text-muted mb-4">
                  Cửa hàng mở cửa từ Thứ 2 đến Thứ 6 (8:00 - 18:00), Thứ 7 (8:00
                  - 16:00)
                </p>
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-primary">🚗 Bãi Đỗ Xe</h6>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-success">🚌 Gần Trạm Xe Buýt</h6>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="bg-white p-3 rounded shadow-sm">
                      <h6 className="text-info">🚇 Gần Metro</h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* FAQ Section */}
      {/* <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="mb-4">Câu Hỏi Thường Gặp</h4>
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq1">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse1"
                    >
                      Làm thế nào để đặt hàng?
                    </button>
                  </h2>
                  <div
                    id="collapse1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Bạn có thể đặt hàng trực tiếp trên website hoặc gọi
                      hotline 1900 1234 567. Chúng tôi sẽ xử lý đơn hàng trong
                      vòng 24h.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq2">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse2"
                    >
                      Thời gian giao hàng là bao lâu?
                    </button>
                  </h2>
                  <div
                    id="collapse2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Thời gian giao hàng từ 1-3 ngày làm việc trong nội thành
                      TP.HCM, 3-5 ngày cho các tỉnh thành khác.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="faq3">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse3"
                    >
                      Có được đổi trả sản phẩm không?
                    </button>
                  </h2>
                  <div
                    id="collapse3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">
                      Chúng tôi hỗ trợ đổi trả sản phẩm trong vòng 7 ngày kể từ
                      ngày nhận hàng, với điều kiện sản phẩm còn nguyên vẹn và
                      có hóa đơn.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Contact;
