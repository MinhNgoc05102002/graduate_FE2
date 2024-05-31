import { Link } from "react-router-dom";
import { IProps } from "~/types/ICredit";
import styles from "~/pages/account/Account.module.scss";
import { BASE_URL_MEDIA } from "~/services/axios";

export default function BoxCreditAccount(props:IProps) {
    const {credit, showProgress=false} = props;
    
    return (
    <Link to={`/credit/${credit.creditId}`} className={`card mb-2 hoverable`}>
        <div className={`${styles.box_padding}`}>
            
            <div className="d-flex align-items-center text-color">
                <div>{credit.countFlashcard > 99 ? '99+' : credit.countFlashcard} thuật ngữ</div>
                <div className={`${styles.divider}`}></div>
                <div className="mx-1 flex-shrink-0">
                    <Link to={`/account/${credit?.createdBy}`} className="avatar align-items-center d-flex w-auto">
                        <img src={BASE_URL_MEDIA + '/' + credit?.avatar} className="w-px-20 h-px-20 rounded-circle" />
                    </Link>
                </div>
                <Link to={`/account/${credit?.createdBy}`} className="text-color align-items-center d-flex">
                    <span className="fw-semibold d-block">{credit?.createdBy}</span>
                </Link>
            </div>
            
            <h5 style={{ marginBottom: '5px' }}>{credit.name}</h5>
            {showProgress ? 
                <div className="progress mt-3" style={{height: "3px"}}>
                    <div
                        className="progress-bar bg-learned shadow-none"
                        role="progressbar"
                        style={{width: `${credit.countLearned*100/credit.countFlashcard}%`}}
                        aria-valuenow= {credit.countLearned}
                        aria-valuemin="0"
                        aria-valuemax={credit.countFlashcard}
                    ></div>
                    <div
                        className="progress-bar bg-known shadow-none"
                        role="progressbar"
                        style={{width: `${credit.countKnown*100/credit.countFlashcard}%`}}
                        aria-valuenow={credit.countKnown}
                        aria-valuemin="0"
                        aria-valuemax={credit.countFlashcard}
                    ></div>
                    <div
                        className="progress-bar bg-good shadow-none"
                        role="progressbar"
                        style={{width: `${credit.countGood*100/credit.countFlashcard}%`}}
                        aria-valuenow={credit.countGood}
                        aria-valuemin="0"
                        aria-valuemax={credit.countFlashcard}
                    ></div>
                </div>
            : null}
        </div> 
    </Link>
    )
};
