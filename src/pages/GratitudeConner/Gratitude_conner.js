import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import Topbar from '../../components/layout/header/header';
import _Footer from '../../components/layout/footer/footer';
import "./Gratitude_conner.css";

export default function GratitudeConner() {
    const [currentPage, setCurrentPage] = useState(0);
    const [tableData, setTableData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const size = 5;
    const pageRange = 5;

    useEffect(() => {
        fetchTotalPages();
        fetchData(currentPage);
    }, [currentPage]);

    const fetchTotalPages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/getAllContributions?page=0&size=${size}`);
            const data = await response.json();
            const totalPages = data.totalPages;
            setTotalPages(totalPages);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchData = async (pageNumber) => {
        try {
            const response = await fetch(`http://localhost:8080/getAllContributions?page=${pageNumber}&size=${size}`);
            const data = await response.json();
            const contributions = data.contributions;
            //   const totalPages = data.totalPages;
            setTableData(contributions);
            //   setTotalPages(totalPages); 
            //   alert(totalPages);
        } catch (error) {
            console.error(error);
        }
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const startPage = Math.max(0, currentPage - Math.floor(pageRange / 2));
    const endPage = Math.min(totalPages - 1, startPage + pageRange - 1);

    return (
        <div className='Container'>
            <div className='header'>
                <Topbar></Topbar>
            </div>
            <div className='body_gratitude'>
                <div className='head_body '>
                    <h1 className='font_chu'>GÓC TRI ÂN</h1>
                    <p className='font_chu'>Thay mặt ban tổ chức chúng tôi xin bày tỏ lòng biết ơn sâu sắc và cảm tạ các quý ân nhân trong hành trình lan tỏa yêu thương đến các mảnh đời có hoàn cảnh khó khăn trên khắp địa bàn tỉnh Nghệ An.</p>
                    <div className='search_parents'><input className='input_search' type="text" value={"Search"} /><img className='icon_search' width="50" height="50" src="https://img.icons8.com/ios/50/search--v1.png" alt="search--v1" /></div>
                </div>
                <div className='content_body'>

                    <div className='div_table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên</th>
                                    <th>Mô tả</th>
                                    <th>Ngày quyên góp</th>
                                    <th>Số tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.description}</td>
                                        <td>{formatDate(item.donationDay)}</td>
                                        <td>{item.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <div>
                            <button onClick={handlePrevPage}>
                                <img width="30px" height="30px" src="https://img.icons8.com/ios/50/back--v1.png" alt="back--v1" />
                            </button>
                            {Array.from({ length: endPage - startPage + 1 }, (_, i) => i + startPage).map((pageNumber) => (
                                <button
                                    key={pageNumber}
                                    onClick={() => handlePageChange(pageNumber)}
                                    className={`pagination-button ${pageNumber === currentPage ? 'active' : ''}`}
                                >
                                    {pageNumber + 1}
                                </button>
                            ))}
                            <button onClick={handleNextPage}>
                                <img width="30px" height="30px" src="https://img.icons8.com/ios/50/forward.png" alt="forward" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='footer_gratitude'>
                <_Footer></_Footer>
            </div>
        </div>
    );
}