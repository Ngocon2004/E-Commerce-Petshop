import React, { use } from "react";
import Button from '@mui/material/Button';
import { Mycontext } from "../../App";
import { useContext, useEffect } from "react";
import google_login from '../../assets/image/google_login.png';
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";


const SignUp = () => {

    const context = useContext(Mycontext);

    useEffect(() => {
        context.setisHeaderFooterShow(false);
    }, []);

    return(
        <>
        <section className="section signInPage signUpPage">
            <div className="shape-bottom">
                
                <div className="container">
                    <div className="box card p-3 shadow border-0">
                        <h2 className="hd mb-4">Đăng ký</h2>
                        <div className="row">
                            <div className="col md-6">
                                <div className="form-group">
                                    <label htmlFor="name">Tên</label>
                                    <input type="text" className="form-control" id="name" placeholder="Nhập tên" />
                                </div>
                            </div>

                            <div className="col md-6">
                                <div className="form-group">
                                    <label htmlFor="password">Số điện thoại</label>
                                    <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại" />
                                </div>
                            </div>

                        </div>
                        <form>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" placeholder="Nhập email" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <input type="password" className="form-control" id="password" placeholder="Nhập mật khẩu" />
                            </div>

                            <div>
                                <a href="/forgot-password" className="float-right mb-3 cursor">Quên mật khẩu?</a>
                            </div>

                            <br/>

                            <div className="d-flex align-items-center mt-3 mb-3"> 
                                <div className="row w-100">
                                    <div className="col-md-6"> 
                                        <Button className="btn-blue col btn-lg btn-big">Đăng ký</Button>
                                    </div>
                                     <div className="col-md-6"> 
                                        <Link to="/signin" className="d-block w-100"><Button className="btn-blue col btn-lg btn-big" 
                                            variant="outlined"onClick={()=>context.setisHeaderFooterShow(false)}>Quay lại</Button></Link>
                                    </div>
                                </div>
                            </div>

                            
                            <h6 className="hd my-3 text-center">Hoặc đăng nhập với</h6>

                           <Button className="loginWithGoogle mt-2" variant="outlined"> <FcGoogle /> Đăng nhập với Google</Button>

                            
                        </form>
                    </div>
                </div>
            </div>

        </section>
        </>
    )
}

export default SignUp;