import React, { useState, useEffect } from 'react';
import Topbar from '../../components/layout/header/header';
import _Footer from '../../components/layout/footer/footer';
import "./Collection_payment.css"

export default function Collection_payment() {
    const [name, setName] = useState('');
    const [money, setMoney] = useState('');
    const [description, setDescription] = useState('');
    const [redirectUrl, setRedirectUrl] = useState(null);

    useEffect(() => {
        if (redirectUrl) {
            // Đẩy URL sang một tab mới
            window.open(redirectUrl, '_blank');
        }
    }, [redirectUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = `http://localhost:8080/pay?price=${money}&name=${name}&description=${description}`;

        try {
            const response = await fetch(url);
            const data = await response.text();
            alert(JSON.stringify(data));

            // Đặt redirectUrl để mở URL trong tab mới
            setRedirectUrl(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='container'>
            <div className='header'>
                <Topbar></Topbar>
            </div>
            <div className='body' >
                <div className='head_body'>
                    <h1 className='font_chu'>Đóng góp trực tiếp vào số tài khoản</h1>
                </div>
                <div className='content_body_payment'>
                    <form onSubmit={handleSubmit}>
                        <div className='Chu_tk'>
                            <label style={{ fontWeight: '600', fontSize: '32px' }} className='font_chu' htmlFor="input_name">Chủ tài khoản :  </label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} className='input_name' />
                        </div>
                        <div className='Tien_khuyen_gop'>
                            <label style={{ fontWeight: '600', fontSize: '32px' }} className='font_chu' htmlFor="So_tien">Nhập số tiền :  </label>
                            <input type="text" onChange={(e) => setMoney(e.target.value)} value={money} className='So_tien  input_name' />
                        </div>
                        <div className='Loi_nhan'>
                            <label style={{ fontWeight: '600', fontSize: '32px' }} className='font_chu' htmlFor="Loi_nhan_input">Nội dung chuyển khoản :  </label>
                            <textarea type="text" onChange={(e) => setDescription(e.target.value)} value={description} className='Loi_nhan_input  input_name' />
                        </div>
                        <div className='Xac_nhan'>
                            <button type='submit' className='btn_confirm'>XÁC NHẬN</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='footer'>
                <_Footer></_Footer>
            </div>
        </div>
    )
}