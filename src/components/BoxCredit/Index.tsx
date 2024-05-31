import { Link } from "react-router-dom";
import { BASE_URL_MEDIA } from "~/services/axios";
import { IProps } from "~/types/ICredit";
import styles from "./BoxCredit.module.scss";
/**
 * Box Credit Dashboard
 * @returns 
 */


// export default function BoxCredit(credit:ICredit) {

export default function BoxCredit(props:IProps) {
    const {credit, showProgress} = props;
    return (
        <>
            <Link to={`/credit/${credit.creditId}`} className="col-md-4">
                <div className="card mb-3">
                    <div className="card-body">
                        <div className="row g-0">
                            {/* nếu có ảnh thì col-md-9, ko có ảnh thì col-md-12 */}
                            <div className="col-md-12" style={{minHeight: '5.5rem'}}>
                                <h5 className="card-title">{credit?.name}</h5>
                                <p className={`card-text fw-semibold ${styles.card_tag}`}>
                                    {credit?.countFlashcard} thuật ngữ
                                </p>
                            </div>
                            {/* <div style={{display: 'none'}} className="col-md-3 d-lg-block">
                                <img className="card-img card-img-right" src="./src/assets/img/elements/17.jpg" alt="Card image" />
                            </div> */}

                            <div className="d-flex">
                                <div className="flex-shrink-0">
                                    <Link to={`/account/${credit?.createdBy}`} className="avatar align-items-center d-flex">
                                        <img src={BASE_URL_MEDIA + '/' + credit?.avatar} className="w-px-30 h-px-30 rounded-circle" />
                                    </Link>
                                </div>
                                <Link style={{color: "#708092"}} to={`/account/${credit?.createdBy}`} className="flex-grow-1 align-items-center d-flex">
                                    <span className="fw-semibold d-block">{credit?.createdBy}</span>
                                </Link>
                            </div>

                            {showProgress ? 
                                <div className="progress mt-3" style={{height: "3px"}}>
                                    <div
                                        className="progress-bar bg-learned shadow-none"
                                        role="progressbar"
                                        style={{width: `${credit.countLearned*100/credit.countFlashcard}%`}}
                                        aria-valuenow= {credit.countLearned}
                                        aria-valuemin={0}
                                        aria-valuemax={credit.countFlashcard}
                                    ></div>
                                    <div
                                        className="progress-bar bg-known shadow-none"
                                        role="progressbar"
                                        style={{width: `${credit.countKnown*100/credit.countFlashcard}%`}}
                                        aria-valuenow={credit.countKnown}
                                        aria-valuemin={0}
                                        aria-valuemax={credit.countFlashcard}
                                    ></div>
                                    <div
                                        className="progress-bar bg-good shadow-none"
                                        role="progressbar"
                                        style={{width: `${credit.countGood*100/credit.countFlashcard}%`}}
                                        aria-valuenow={credit.countGood}
                                        aria-valuemin={0}
                                        aria-valuemax={credit.countFlashcard}
                                    ></div>
                                </div>
                            : null}
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
};
