import React, {useEffect, useState} from "react";
import {NotVerified} from "../../../static/icon/NotVerified";
import {Verified} from "../../../static/icon/Verified";
import SearchBar from "../../../component/Search";

const PopupDetailPageSale = ({dataDetail}) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [dataPageSale, setDataPageSale] = useState([])
    const [accountId, setAccountId] = useState(null)
    const [infos, setInfos] = useState<any>([]);
    const [orderBy, setOrderBy] = useState(1) //asc
    const [filteredList, setFilteredList] = useState(infos);




    const compareData = ( a, b, field ) => {
        if (a[field] < b[field]) {
            return -1;
        } else if (a[field] > b[field]) {
            return 1;
        } else {
            return 0;
        }
    };


    const handleSortItemNumber = ( field ) => {
        const compareField = ( a, b ) => compareData(a, b, field)
        if (orderBy === 1) {
            setInfos(( pre ) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(0);
                return storeData.reverse()
            })
        } else {
            setInfos(( pre ) => {
                const storeData = [...pre].sort(compareField);
                setOrderBy(1);
                return storeData
            })
        }
    };


    const handleChangeDataRaw = () => {
        if (typeof dataPageSale === "object" && Array.isArray(dataPageSale)) {
            let dataInfos = [];
            for (let i = 0; i < dataPageSale.length; i++) {
                const hasPermissionPost = dataPageSale[i].roles.data.some(item => item.id === accountId && item.tasks.includes("CREATE_CONTENT"));
                dataInfos.push({
                    STT : i + 1,
                    AVATAR : dataPageSale[i]?.picture.data.url,
                    ID_PAGE_SALE : dataPageSale[i].id,
                    NAME_PAGE : dataPageSale[i].name,
                    VERIFIED : dataPageSale[i].verification_status,
                    LIKES : dataPageSale[i].fan_count,
                    FOLLOWERS : dataPageSale[i].followers_count,
                    PERMISSION_POST : hasPermissionPost ? 1 : 0,
                    ADS : dataPageSale[i].is_promotable ? 1 : 0,
                    ADS_COUNT : 0
                })
            }
            setInfos(dataInfos)
        }

    }

    const handleReloadStorage = ( e: any ) => {
        window.location.reload();
        chrome.runtime.sendMessage({ action : "reload_storage" }, function ( response ) {
            console.log(response);
        });
    };

    useEffect(() => {
        setDataPageSale(dataDetail.fanPages)
    }, []);

    useEffect(() => {
        setFilteredList(infos)
    }, [infos]);

    useEffect(() => {
        handleChangeDataRaw()
    }, [dataPageSale, accountId]);


    return (
        <>
            <div className="app" style={{ padding : 0, height : "100vh" }}>
                <div className="wrapper" id="main" style={{ padding : 0 }}>
                    <div className="sc_heading" style={{ padding : 0 }}>
                        <div className="command">
                            <div className="command_head" style={{ backgroundColor : "#2b3054" }}>
                                <div className="command_flex">
                                    <SearchBar filteredList={filteredList} infos={infos}
                                               setFilteredList={setFilteredList}/>
                                </div>
                                <div className="command_flex">

                                    <div className="command_btn" id="btn_export" onClick={handleReloadStorage}>
                                        <span>Reload Page</span>
                                        <i className="fa-solid fa-download"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="AccStatus" className="tabcontent active">
                        <div className="loaddata1" style={{ display : "none" }}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table className="table table-striped" id="tball">
                            <thead id="thall">
                            <tr>
                                <th className="sort">STT</th>
                                <th
                                    className="sort"
                                >
                                    Avatar
                                </th>
                                <th className="sort">ID</th>
                                <th className="sort">Tên Page</th>
                                <th
                                    className="sort"

                                >
                                    Verified
                                </th>
                                <th
                                    className="sort"
                                    onClick={() => handleSortItemNumber("LIKES")}
                                >
                                    Likes
                                </th>

                                <th
                                    className="sort"
                                    style={{ minWidth : "100px" }}
                                    onClick={() => handleSortItemNumber("FOLLOWERS")}
                                >
                                    Followers
                                </th>
                                <th
                                    className="sort"
                                    style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("PERMISSION_POST")}
                                >
                                    Quyền đăng
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}
                                    onClick={() => handleSortItemNumber("ADS")}
                                >
                                    Quảng cáo
                                </th>
                                <th className="sort" style={{ minWidth : "70px" }}

                                >
                                    ADS Count
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {filteredList.map(( item, key ) => (
                                <tr className="trInfo" key={key}>
                                    <td className="tdInfo">{item.STT}</td>
                                    <td className="tdInfo">
                                        <div className="tbstatus"
                                             style={{
                                                 display : "flex",
                                                 justifyContent : "center",
                                                 alignItems : "center"
                                             }}
                                        >
                                            <img src={item.AVATAR} alt=""/>
                                        </div>
                                    </td>
                                    <td className="tdInfo"> {item.ID_PAGE_SALE}</td>
                                    <td className="tdInfo"> {item.NAME_PAGE}</td>
                                    <td className="tdInfo"> {item.VERIFIED === "not_verified" ?
                                        <div style={{
                                            display : "flex",
                                            justifyContent : "center",
                                            alignItems : "center"
                                        }}><NotVerified/></div> :
                                        <div style={{
                                            display : "flex",
                                            justifyContent : "center",
                                            alignItems : "center"
                                        }}><Verified/></div>
                                    }</td>
                                    <td className="tdInfo"> {item.LIKES}</td>
                                    <td className="tdInfo"> {item.FOLLOWERS}</td>
                                    <td className="tdInfo"> {item.PERMISSION_POST === 1 ? "true" : "false"}</td>
                                    <td className="tdInfo">
                                        <span className="r">{item.ADS === 1 ? 'true' : 'false'}</span>
                                    </td>
                                    <td className="tdInfo">
                                        <span className="r">{item.ADS_COUNT}</span>
                                    </td>


                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PopupDetailPageSale;