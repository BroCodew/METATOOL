import React, {useEffect, useRef, useState} from "react";
import {v4 as uuidv4} from "uuid";
import {useNavigate} from "react-router-dom";
import styles from "./styles/index.module.scss";
import {Button, Checkbox, Input, Spinner, Stack} from "@chakra-ui/react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import SearchBar from "../../component/Search";
import {addDays, format, parseISO} from "date-fns";
import {Calendar} from "react-date-range";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';


const PopupContainer = () => {

    const [detailParam, setDetailParam] = useState(null);
    const [infos, setInfos] = useState([]);
    const [orderBy, setOrderBy] = useState(1)
    const [copied, setCopied] = useState<boolean>(false);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [calendar, setCalendar] = useState(format(new Date(), 'dd-MM-yyyy'));
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const refCalendar = useRef(null);

    const formatDateFn = ( dateString ) => {
        const dateObject = new Date(dateString);
        return format(dateObject, 'dd-MM-yyyy');
    }

    const clickOutside = ( event ) => {
        if (refCalendar.current && !refCalendar.current.contains(event.target)) {
            setIsOpen(false)
        }
    }

    const getDataContainer = () => {
        chrome.runtime.sendMessage({ action : "get_data_container" }, ( response ) => {
            if (response) {
                const dataAccounts = response.data.data.accounts;
                for (let i = 0; i < dataAccounts.length; i++) {
                    const totalBalance = dataAccounts[i].totalBalance.map(( item ) => convertCurrency(item.balance, item.currency, item.account_currency_ratio_to_usd));
                    const sumOfBalances = totalBalance.reduce(( accumulator, currentValue ) => {
                        return accumulator + (isNaN(currentValue) ? 0 : currentValue);
                    }, 0);
                    const threshold = dataAccounts[i].totalThresholdAmount.map(( item ) => {
                        return convertCurrency(item.thresholdAmount === null ? 0 : item.thresholdAmount.map(item =>
                            item.threshold_amount), item.currency, item.account_currency_ratio_to_usd)
                    })
                    const totalThreshold = threshold.map(( item ) => typeof item === 'number' ? item : item[0]);
                    const sumOfThresHold = totalThreshold.reduce(( accumulator, currentValue ) => {
                        return accumulator + (isNaN(currentValue) ? 0 : currentValue);
                    }, 0);
                    const spending = dataAccounts[i].totalSpend.map(item => convertCurrencyNormal(item.totalSpend === null ? 0 : item.totalSpend.map(item => (item.spend)), item.account_currency_ratio_to_usd))
                    const sumOfSpending = spending.reduce(( accumulator, currentValue ) => {
                        return accumulator + (isNaN(currentValue) ? 0 : currentValue);
                    }, 0);
                    const formattedDate = ( value ) => {
                        const inputDate = new Date(value);
                        const formattedDate = format(inputDate, "dd-MM-yyyy");
                        return formattedDate;
                    }
                    const date = dataAccounts[i].createdAt;
                    const convertDate = formattedDate(date);
                    console.log('convertDate', convertDate);
                    dataAccounts[i].DEBT_TOTAL
                        = convertNumberToUsd(sumOfBalances);
                    dataAccounts[i].TOTAL_THRESHOLD = convertNumberToUsd(sumOfThresHold);
                    dataAccounts[i].TOTAL_SPENDING_HOME = convertNumberToUsd(sumOfSpending);
                    dataAccounts[i].DATE = convertDate;
                }
                console.log("dataAccounts dataAccounts", dataAccounts)
                setInfos(response.data.data.accounts);
                setLoading(false)
            } else {
                console.error(response.error);
                console.error(response ? response.error : "Không có phản hồi hoặc success:false");
            }
        })
    }

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

    const convertNumberToUsd = ( value ) => {
        let USDollar = new Intl.NumberFormat('en-US', {
            style : 'currency',
            currency : 'USD',
        });
        return USDollar.format(value);
    }

    const handleCopyCookie = ( index ) => {
    };

    const covertCookies = ( cookies ) => {
        const jsonArray = JSON.parse(cookies);
        if (jsonArray && jsonArray.length > 0) {
            const result = jsonArray.map(( item ) => `${item.name}=${item.value}`).join("; ");
            return result;
        }
    }


    const convertCurrency = ( value, currency, ratio ) => {
        let usd;
        switch (currency) {
            case 'CLP':
            case 'COP':
            case 'CRC':
            case 'HUF':
            case 'ISK':
            case 'IDR':
            case 'JPY':
            case 'KRW':
            case 'PYG':
            case 'TWD':
            case 'VND':
                usd = value / ratio;
                break;
            default:
                usd = value / 100 / ratio;
                break;
        }
        return usd;
    }

    const convertCurrencyNormal = ( value, ratio ) => {
        let usd;
        usd = value / ratio;
        return usd;
    }


    const handleSelectDate = ( date ) => {
        let filter = [];
        const formattedDate = formatDateFn(date);
        setCalendar(formattedDate);
        filter = infos.filter(( item ) => item.DATE === formattedDate);
        setFilteredList(filter);
    }
    const filToday = ( dateFilter ) => {
        const date = new Date();
        let filter = [];
        switch (dateFilter) {
            case 'today':
                const formattedToday = format(date, 'dd-MM-yyyy');
                filter = infos.filter(( item ) => item.DATE === formattedToday);
                break;
            case 'yesterday':
                const yesterday = new Date(date);
                yesterday.setDate(date.getDate() - 1);
                const formattedYesterday = format(yesterday, 'dd-MM-yyyy');
                console.log('formattedYesterday', formattedYesterday)
                filter = infos.filter(( item ) => item.DATE === formattedYesterday);
                console.log('dayfileter', filteredList.filter(( item ) => item.DATE === formattedYesterday))
                break;
            case 'allTime':
                filter = infos;
                break;
            default:
                break;
        }
        setFilteredList(filter);
    };
    console.log('infos', infos)

    useEffect(() => {
        if (detailParam) {
            navigate(`/popup.html/detail/${detailParam}`, { replace : true, state : { detailParam } });
        }
    }, [detailParam]);


    useEffect(() => {
        setFilteredList(infos)
    }, [infos]);

    useEffect(() => {
        document.addEventListener("click", clickOutside, true);
    }, []);


    useEffect(() => {
        getDataContainer();
    }, []);

    if (loading) {
        return (
            <div className={styles.spinnerContainer}>
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                    className={styles.ChakraSpinner}
                />
            </div>
        )
    }


    return (
        !loading &&
        <>
            <div className="app" style={{ height : "100vh" }}>
                <div className="wrapper" id="main">

                    <div className="sc_heading" style={{ marginBottom : "20px", backgroundColor : 'transparent' }}>
                        <SearchBar filteredList={filteredList} infos={infos} setFilteredList={setFilteredList}/>
                        <div style={{ display : 'flex', flexDirection : 'row' }}>
                            <div>
                                <Button onClick={() => filToday("today")}>Hôm nay</Button>
                                <Button onClick={() => filToday("yesterday")}
                                        style={{ marginLeft : '10px', marginRight : '10px' }}>Hôm qua</Button>
                                <Button onClick={() => filToday("allTime")}>All time</Button>
                            </div>
                            <div style={{ marginLeft : '40px' }}>
                                <Input bgColor={"#fff"} className={styles.inputCalendar} placeholder='small size'
                                       size='sm' value={calendar} onClick={() => setIsOpen(true)}/>
                            </div>
                            <div ref={refCalendar} className={styles.calenderContainer}>
                                {isOpen && <Calendar date={new Date()} onChange={handleSelectDate}/>}
                            </div>
                        </div>
                    </div>
                    <div
                        id="AccStatus"
                        className="tabcontent active">
                        <div className="loaddata1" style={{ display : "none" }}>
                            <img
                                src="chrome-extension://ookgnahfklmejhicejjbfjifppjbfnlk/access/icon/loadingdata.gif"
                                alt=""
                            />
                        </div>
                        <table
                            className="table table-striped"
                            id="tball"
                        >
                            <thead id="thall">
                            <tr>
                                <th className="sort">STT</th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("DATE_HOME")}
                                >DATE
                                </th>
                                <th className="sort">COOKIES</th>
                                <th className="sort">CHECKER</th>
                                <th className="sort" onClick={() => handleSortItemNumber("ID_TKQC_HOME")}>ID</th>
                                <th className="sort">Tên TK</th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Profile Chrome
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >IP
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Quốc Gia
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_ACCOUNT_ADS")}
                                >Tổng TKQC
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_BM")}
                                >Tổng BM
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_SPENDING_HOME")}
                                >Tổng Tiêu
                                </th>
                                <th className="sort"
                                    onClick={() => handleSortItemNumber("TOTAL_THRESHOLD")}
                                >Tổng Ngưỡng
                                </th>
                                <th className="sort" style={{ minWidth : "100px" }}
                                    onClick={() => handleSortItemNumber("DEBT_TOTAL")}
                                >
                                    Tổng Dư nợ
                                </th>

                            </tr>
                            </thead>
                            <tbody id="tb">
                            {filteredList.map(( item, key ) => (
                                <tr className="trInfo" key={uuidv4()}
                                    style={{ backgroundColor : copied[key] ? "red" : "transparent" }}>
                                    <td className="tdInfo">{key + 1}</td>
                                    <td className="tdInfo"> {item.DATE}</td>
                                    <td className="tdInfo">
                                        <div style={{
                                            display : "flex",
                                            justifyContent : "space-around",
                                            marginTop : 5
                                        }}>

                                            <CopyToClipboard
                                                text={covertCookies(item.cookie)}
                                                onCopy={() => handleCopyCookie(key)}>
                                                <Button
                                                    colorScheme='whatsapp'>{copied[key] ? "COPIED" : "COPY"}
                                                </Button>
                                            </CopyToClipboard>
                                        </div>
                                    </td>
                                    <td className="tdInfo">
                                        <Stack spacing={[1, 5]} direction={['column', 'row']}
                                               style={{ display : "flex", justifyContent : "center", marginTop : 5 }}>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr D
                                            </Checkbox>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr H
                                            </Checkbox>
                                            <Checkbox size='sm' colorScheme='green'>
                                                Mr A
                                            </Checkbox>
                                        </Stack>
                                    </td>
                                    <td className="tdInfo"
                                        style={{ textAlign : "center", overflow : "hidden" }}> {item.uid}</td>
                                    <td className="tdInfo"> {item.name}</td>
                                    <td className="tdInfo">
                                        {item.userAgent}
                                    </td>
                                    <td className="tdInfo"> {item.ip}</td>
                                    <td className="tdInfo"> {item.country}</td>
                                    <td className="tdInfo">
                                        <span className="r">{item.countAdAccount}</span>
                                    </td>
                                    <td className="tdInfo"
                                    >
                                        <span className="r">{item.countBm}</span>
                                    </td>
                                    <td className="tdInfo"
                                    >
                                        <span className="r">{item.TOTAL_SPENDING_HOME}</span>

                                    </td>
                                    <td className="tdInfo"
                                    >
                                        <span className="r">{item.TOTAL_THRESHOLD}</span>
                                    </td>
                                    <td className="tdInfo"

                                    >
                                        <span className="r">{item.DEBT_TOTAL}</span>


                                    </td>
                                    <td className={styles.optionValue}>

                                        <Button
                                            onClick={() => setDetailParam(item.uid)}
                                            m={4}
                                            className={styles.optionButton}
                                        >{`Open Detail Cookie`}</Button>
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

export default PopupContainer;