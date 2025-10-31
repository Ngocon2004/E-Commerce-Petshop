import React from "react";
import useGetData from "../custom-hooks/useGetData";
import { db } from "../firebase.config";
import { doc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";


const Users = () => {
  const { data: usersData, loading } = useGetData("user");

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, "users", id));
    toast.success("Người dùng đã được xóa");
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="fw-bolc">Người dùng</h4>
          </div>
          <div className="col-lg-12">
            <table className="table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <h5 className="py-5 fw-bold">Đang tải...</h5>
                ) : (
                  usersData?.map((user) => (
                    <tr key={user.uid}>
                      <td>
                        <img src={user.photoURL} alt="" />
                      </td>
                      <td>{user.displayName}</td>
                      <td>{user.email}</td>
                      <td>
                        <Button onClick={()=>{deleteUser(user.id)}} className="btn btn-danger">Xóa</Button>
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

export default Users;
