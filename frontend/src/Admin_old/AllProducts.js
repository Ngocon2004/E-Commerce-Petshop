import React from "react";
import useGetData from "../custom-hooks/useGetData";
import { db } from '../firebase.config'
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from 'react-toastify'


const AllProducts = () => {
  const { data: productsData, loading } = useGetData("products");

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', id))
    toast.success('Sản phẩm đã được xóa');
  }

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h3 className="py-5">Đang tải...</h3>
                ) : (
                  productsData?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img src={item.imgUrl} alt="" />
                      </td>
                      <td>{item.productName}</td>
                      <td>{item.category.toUpperCase()}</td>
                      <td>{item.price} đ</td>
                      <td>
                        <button onClick={()=>{deleteProduct(item.id)}} className="btn btn-danger py-1 my-1">Xóa</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProducts;
