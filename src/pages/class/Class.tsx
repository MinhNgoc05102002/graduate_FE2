import Tooltip from "@mui/material/Tooltip";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import BoxCreditAccount from "~/components/Account/Box/BoxCreditAccount";
import Loading from "~/components/Loading/Index";
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from "~/services/axios";
import { ICredit } from "~/types/ICredit";
import { CheckResponseSuccess, GetIdFromCurrentPage } from "~/utils/common";
import styles from "./Class.module.scss";
import classNames from "classnames/bind";
import ListCredit from "~/components/Account/ListCredit";
import ListFolder from "~/components/Account/ListFolder";
import ListClass from "~/components/Account/ListClass";
import Maintain from "../maintain/Maintain";
import ListMember from "~/components/Class/ListMember";

const cx = classNames.bind(styles);

const LIST_NAVBAR = [
    {
        id: "CREDIT",
        title: "Bộ thẻ",
        url: '/',
        component: ListCredit,
    },
    {
        id: "FOLDER",
        title: "Thư mục",
        url: '/folders',
        component: ListFolder,
    },
    {
        id: "CLASS",
        title: "Thành viên",
        url: '/members',
        component: ListMember,
    },
];

export default function Class() {
    const [content, setContent] = useState(LIST_NAVBAR[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [folder, setFolder] = useState<IUser|null>(null);
    const userData = useAppSelector(inforUser);
    const folderId = GetIdFromCurrentPage();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(1);
    const [totalPage, setToTalPage] = useState(1);
    const [listCredit, setListCredit] = useState<ICredit[]>([]);

    useEffect(() => {
        getInfoFolder();
        getRecentCredit();
    }, [folderId]);


    const getInfoFolder = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Account/get-account-by-username", 
            folderId, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let account = res?.returnObj;
                if (account) {
                    setFolder(account);
                }
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    }; 

    // lấy tạm, đang sai
    const getRecentCredit = async () => {
        // dispatch(login(formLogin))
        setIsLoading(true);
        await Post(
            "/api/Credit/get-list-credit-by-user", 
            {
                pageSize: 5,
                pageIndex: pageIndex,
                searchText: search,
                username: 'ngoc_nguyen'
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let listCredit = res?.returnObj?.listResult;
                setListCredit(listCredit);
                setToTalPage(res?.returnObj?.totalPage)
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    };

    const handleSearch = (e:any = null) => {
        setPageIndex(1)
        e?.preventDefault();
        // getRecentCredit()
    }

    // if (!folder) {
    //     return (
    //         <>
    //             {isLoading ? null : <NotFound />}
    //             <Loading isLoading={isLoading}/>
    //             <ToastContainer />
    //         </>
    //     )
    // }

    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />

            <div className={`container-xxl flex-grow-1 container-p-y ${styles.container}`}>

                <div className={styles.header_author}>
                    <div className="d-flex align-items-center">
                        {/* <div className={styles.count}>5 bộ thẻ</div>

                        <div className="">tạo bởi</div>
                        <div className={styles.avt}>
                            <Link to={`/account`} className="avatar align-items-center d-flex w-auto">
                                <img src="http://localhost:5173/src/assets/img/avatars/ngoc.jpg" className="w-px-20 h-auto rounded-circle" />
                            </Link>
                        </div>
                        <Link to={`/account/`} className={styles.name}>
                            <span className="fw-semibold d-block">ngoc</span>
                        </Link> */}

                        <div className={styles.title}>
                            <h2 className={styles.name}>
                                <i className={`bx bx-group ${styles.icon}`}></i>
                                Từ mới ngữ pháp
                            </h2>

                            <div className={styles.descrip}>
                                Từ mới trong các bài ngữ pháp học online
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className={styles.btn}>
                        <Tooltip title="Chia sẻ" placement="top" arrow>
                            <span className='bx bxs-share-alt'></span>
                        </Tooltip>
                        <Tooltip title="Sửa" placement="top" arrow>
                            <span className='bx bxs-pencil'></span>
                        </Tooltip>
                        <Tooltip title="Xóa, Sao chép, ..." placement="top" arrow>
                            <span className='bx bx-dots-horizontal-rounded'></span>
                        </Tooltip>
                    </div>
                </div>
                {/* <div className={styles.title}>
                    <h2 className={styles.name}>
                        <i className={`bx bx-group ${styles.icon}`}></i>
                        Từ mới ngữ pháp
                    </h2>

                    <div className={styles.descrip}>
                        Từ mới trong các bài ngữ pháp học online
                    </div>
                </div> */}
                
                <div className="tab">
                    <div className={cx("navbar")}>
                        <div className={cx("navbar_container")}>
                            {/* {LIST_NAVBAR.map((nav) => {
                                return (
                                    <NavLink key={nav.id} className={cx("navbar_item")} to={nav.url}>
                                        {({ isActive }) => {
                                            return ((
                                                <>
                                                    <span className={cx("", { title_active: isActive })}>{nav.title}</span>
                                                    <div className={cx("", { underline: isActive })}></div>
                                                </>
                                            ))
                                        }}
                                    </NavLink>
                                )
                            })} */}

                            {LIST_NAVBAR.map((nav) => {
                                return (
                                    <div key={nav.id} className={cx("navbar_item")} onClick={() => setContent(nav)}>
                                        <span className={cx("", { title_active: nav.id == content.id })}>{nav.title}</span>
                                        <div className={cx("", { underline: nav.id == content.id })}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>



                <div>
                    {content.component ? <content.component username={userData?.username} showTime={false} type="CLASS"/> : null}
                </div>

            </div>
        </>
    )
};