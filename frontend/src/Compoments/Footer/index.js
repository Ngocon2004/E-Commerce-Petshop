import { FaShippingFast } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { CiBadgeDollar } from "react-icons/ci";
import { GiOpenedFoodCan } from "react-icons/gi";
import { IoMailOutline } from "react-icons/io5";
import { LuPhoneCall } from "react-icons/lu";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";
import { CiTwitter } from "react-icons/ci";
import Button from '@mui/material/Button';


import Link from "@mui/material/Link";


const Footer = () => {
    return (
        <>
        <footer>
            <div className="container">
                <div className="topInfo row">
                    <div className="col d-flex align-items-center">
                        <div className="col d-flex align-items-center">
                            <GiOpenedFoodCan />
                            <span className="ml-2">Thức ăn cho thú cưng</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <FaShippingFast />
                            <span className="ml-2">Miễn phí vận chuyển cho đơn từ 299.000</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <CiDiscount1 />
                            <span className="ml-2">Giảm giá 10% cho đơn hàng đầu tiên</span>
                        </div>

                        <div className="col d-flex align-items-center">
                            <CiBadgeDollar />
                            <span className="ml-2">Giá tốt nhất thị trường</span>
                        </div>
                    </div>
                </div>

                <div className=" row mt-3 linkWrap">
                    <div className="col">
                        <h5>Cửa hàng</h5>
                        <ul>
                            <li><Link to="#">Dành Cho Chó</Link></li>
                            <li><Link to="#">Dành Cho Mèo</Link></li>
                            <li><Link to="#">Blog</Link></li>
                            <li><Link to="#">Bộ Sưu Tập</Link></li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>PetShop</h5>
                        <ul>
                            <li><Link to="#">Giới Thiệu</Link></li>
                            <li><Link to="#">Thành Viên</Link></li>
                            <li><Link to="#">Điều Khoản Sử Dụng</Link></li>
                            <li><Link to="#">Tuyển Dụng</Link></li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>Chăm Sóc Khách Hàng</h5>
                        <ul>
                            <li><Link to="#">Chính Sách Đổi Trả Hàng</Link></li>
                            <li><Link to="#">Phương Thức Vận Chuyển</Link></li>
                            <li><Link to="#">Chính Sách Bảo Mật</Link></li>
                            <li><Link to="#">Phương Thức Thanh Toán</Link></li>
                            <li><Link to="#">Chính Sách Hoàn Tiền</Link></li>
                        </ul>
                    </div>

                    <div className="col">
                        <h5>Liên Hệ</h5>
                        <ul>
                            <li><Link to="#">Công Ty TNHH PetShop</Link></li>
                            <li><Link to="#">MST: 0123456789</Link></li>
                            <li><Link to="#">Địa chỉ: 123 Đường ABC, Phường 8, TP.Đà Lạt</Link></li>
                            <li><Link to="#"><LuPhoneCall /> Hotline:  0123 456 789</Link></li>
                            <li><Link to="#"><IoMailOutline /> Email:  2212363@dlu.edu.vn</Link></li>
                        </ul>
                    </div>

                </div>

                <div className="copyright mt4 pt-3 pb-3 d-flex">
                    <p className="mb-0">© 2023 PetShop. Đồ Án Chuyên Ngành.</p>
                    <ul className="list list-inline ml-auto mb-0 socials">
                        <li className="list-inline-item">
                            <Link to="#"><FaFacebookF /></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><FaInstagram /></Link>
                        </li>
                        <li className="list-inline-item">
                            <Link to="#"><CiTwitter /></Link>
                        </li>
                    </ul>

                </div>

            </div>
        </footer>
        </>
    )
}
export default Footer;