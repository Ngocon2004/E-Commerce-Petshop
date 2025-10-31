import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa";
import Dialog from '@mui/material/Dialog';
import { IoMdSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { useContext, useEffect } from "react";
import { Mycontext } from "../../../App";




const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDropDown = () => {

    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedTab, setSelectedTab] = useState(null);
    const [countryList, setCountryList] = useState([]);

    // useEffect(() => {}, [])
    const context = useContext(Mycontext);

    const selectCountry=(index, country)=>{
        setSelectedTab(index);
        setIsOpenModal(false);
        context.setSelectedCountry(country);
    }

    useEffect(() => {
        setCountryList(context.countryList);
    },[]);

    const filterList=(e)=>{
        const keyword=e.target.value.toLowerCase();
        if(keyword===''){
             const list= countryList.filter((item)=>{
                return item.country.toLowerCase().includes(keyword);
            });
            setCountryList(list);
        }else{   
        setCountryList(context.countryList);
        }

    }


    return (
        <>
        <Button className='countryDrop' onClick={ () => setIsOpenModal(true) }>
           <div className="info d-flex flex-column"> 
                 <span className='lable'> Ngôn ngữ </span>
                 <span className='name'> {context.selectedCountry!=="" ? context.
                 selectedCountry.length>10 ? context.selectedCountry?.substr(0, 15) +'...' : context.selectedCountry : 'Chọn quốc gia'} </span> 
            </div>
            <span className='ml-auto'> <FaAngleDown /> </span>
        </Button>

        <Dialog TransitionComponent={Transition} open={isOpenModal} onClose={() => setIsOpenModal(false)} className='locationModal'>
            <h4 className='mb-0'>Chọn Ngôn Ngữ</h4>
            <p> Nhập khu vực của bạn</p>
            <Button className='close_' onClick={ () => setIsOpenModal(false) }><MdClose /></Button>

            <div className='headerSearch w-100'>
                <input type='text' placeholder='Khu vực của bạn...' onChange={filterList} />
                <Button><IoMdSearch /></Button>                        
            </div>
            <ul className='countryList mt-3'>
                {
                    countryList?.length!==0&& countryList?.map((item, index)=>{
                        return(
                           <li key={index}><Button onClick={ () => selectCountry(index, item.country) }
                           className={` ${selectedTab===index?'active':''}`}
                           >{item.country}</Button></li>
                        )
                    })
                }
            </ul>
        </Dialog>
        </>
    )
}
export default CountryDropDown;