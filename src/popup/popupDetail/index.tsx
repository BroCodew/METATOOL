import React, {useEffect, useState} from "react";
import styles from "./styles/index.module.scss";
import {v4 as uuidv4} from "uuid";
import {Spinner, Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react";
import PopupDetailAD from "./detailPage";
import PopupDetailPageSale from "./detailPageSale";
import PopupDetailBM from "./detailBM";
import {images} from "../../static/icon";
import {useLocation, useNavigate} from "react-router-dom";

const PopupDetail = () => {
    const [loading, setLoading] = useState(true)
    const [dataDetail,setDataDetail] = useState<any>();
    const navigate = useNavigate()
    const location = useLocation();
    const { detailParam } = location.state || {};
    console.log('navigate',detailParam);

    const hanldeTurnBack = () => {
        navigate("/popup.html")
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if(detailParam){
                const response = await fetch(`https://api.getadblockfree.com/account/detail?uid=${detailParam}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                const result = await response.json();
                    setDataDetail(result.data.accounts);
                    console.log('result', result)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    console.log(dataDetail)


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
            <Tabs variant='soft-rounded' colorScheme='green'>
                <div className={styles.tabListContainer}>

                    <TabList className={styles.popupTabList} style={{ width : 157 }}>
                        <Tab>AD</Tab>
                        <Tab>BM</Tab>
                        <Tab>PAGE</Tab>
                    </TabList>
                    <div onClick={hanldeTurnBack} className={styles.turnBack}>
                        <img src={images.TurnBack}/>
                    </div>
                </div>

                <TabPanels>
                    <TabPanel style={{ padding : 0 }}>
                        <PopupDetailAD dataDetail={dataDetail} detailParam={detailParam}/>
                    </TabPanel>
                    <TabPanel style={{ padding : 0 }}>
                        <PopupDetailBM dataDetail={dataDetail}/>
                    </TabPanel>
                    <TabPanel style={{ padding : 0 }}>
                        <PopupDetailPageSale dataDetail={dataDetail}/>
                    </TabPanel>

                </TabPanels>
            </Tabs>

        </>
    );
};

export default PopupDetail