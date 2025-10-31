import React, { useState } from "react";
import { toast } from "react-toastify";
import { db, storage } from "../firebase.config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [loading, setLoading] = useState(false);

  const [entertitle, setTitle] = useState("");
  const [entershortDesc, setShortDesc] = useState("");
  const [enterdescription, setDescription] = useState("");
  const [entercategory, setCategory] = useState("");
  const [enterprice, setPrice] = useState("");
  const [enterproductImg, setProductImg] = useState(null);

  const navigate = useNavigate();

  const addProduct = async (e) => {
    // console.log(enterproductImg.name);
    e.preventDefault();
    setLoading(true);

    // ======= add product to the firebase database =========

    try {
      const docRef = collection(db, "products");
      const storageRef = ref(
        storage,
        `productImages/${Date.now() + enterproductImg.name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, enterproductImg);

      uploadTask.on(
        () => {
          toast.error("Lỗi tải ảnh lên");
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(docRef, {
              productName: entertitle,
              shortDesc: entershortDesc,
              description: enterdescription,
              category: entercategory,
              price: enterprice,
              imgUrl: downloadURL,
            });
          });
        }
      );
      setLoading(false);
      toast.success("Thêm sản phẩm thành công!");
      navigate("/dashboard/all-products");
    } catch (error) {
      setLoading(false);
      toast.error("Thêm sản phẩm không thành công");
    }
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            {loading ? (
              <h4 className="py-5">Đang tải...</h4>
            ) : (
              <>
                <h4 className="mb-5">Thêm sản phẩm</h4>
                <form action="" onSubmit={addProduct}>
                  <div className="form__group">
                    <span>Tên sản phẩm</span>
                    <input
                      type="text"
                      name="title"
                      placeholder="Tên sản phẩm"
                      value={entertitle}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form__group">
                    <span>Mô tả ngắn</span>
                    <input
                      type="text"
                      name="shortDesc"
                      placeholder="Mô tả ngắn về sản phẩm"
                      value={entershortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}   
                    />
                  </div>
                  <div className="form__group">
                    <span>Mô tả chi tiết</span>
                    <input
                      type="text"
                      name="description"
                      placeholder="Mô tả chi tiết về sản phẩm"
                      value={enterdescription}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between gap-5">
                    <div className="form__group w-50">
                      <span>Giá</span>
                      <input
                        type="number"
                        name="price"
                        placeholder="500.000 Đ"
                        value={enterprice}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form__group w-50">
                      <span>Danh mục</span>
                      <select
                        className="w-50 p-2 rounded border-dark"
                        name="category"
                        value={entercategory}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                      >
                        <option className="text-center">Chọn danh mục</option>
                        <option value="dog">Chó</option>
                        <option value="cat">Mèo</option>
                        <option value="rabbit">Thỏ</option>
                        <option value="productForDog">Đồ cho chó</option>
                        <option value="productForCat">Đồ cho mèo</option>
                      </select>
                    </div>
                  </div>
                  <div className="form__group">
                    <span>Ảnh sản phẩm</span>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      name="imgUrl"
                      onChange={(e) => setProductImg(e.target.files[0])}
                      required
                    />
                  </div>
                  <button type="submit" className="buy__btn btn">
                    Thêm sản phẩm
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddProducts;
