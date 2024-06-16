import { IFlashcardProps } from "~/types/IFlash";
import styles from "./CreditComponent.module.scss";
import { BASE_URL_MEDIA, Post } from "~/services/axios";
import { CheckResponseSuccess, handleSpeak } from "~/utils/common";
import { toast } from "react-toastify";

// export default function Card (props:{flashcard:IFlashcardProps, index:string}) {
export default function Card (props:IFlashcardProps) {
    const flashcard = props.flashcard;

    // function handleSpeak(text:string) {
    //     let utterance = new SpeechSynthesisUtterance(text);
    //     // utterance.lang = 'ja-JP';
    //     // const voices = speechSynthesis.getVoices();
    //     //     const vietnameseVoices = voices.filter(voice => voice.lang == 'ja-JP');
    //     //     console.log(vietnameseVoices, voices);
            
    //     //     if (vietnameseVoices.length > 0) {
    //     //         utterance.voice = vietnameseVoices[0];
    //     //         console.log('ik');
                
    //     //     }

    //     speechSynthesis.speak(utterance);
    // }

    async function handleSave (flashcardId:string) {
        await Post(
            "/api/Flashcard/save-flashcard", 
            {
                flashcardId: flashcardId,
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                toast.success("Đã thêm thẻ vào mục đã lưu");
            }
            else {
                toast.error("Đã có lỗi xảy ra.");
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
    }

    return (
        <div className={`${styles.card_container} card row`}>
            <div className={`${styles.question} col-3`}>
                {flashcard?.question}
            </div>
            <div className={styles.divider}></div>
            <div className={`${styles.answer} col-8`}>
                {flashcard?.answer}
                {flashcard?.image ?
                    <div className={`${styles.image}`}>
                        <img className={styles.img} src={`${BASE_URL_MEDIA}/${flashcard.image}`} alt="Card image" />
                    </div>
                    // <div className={`${styles.image}`}  style={{backgroundImage: `url(${decodeURIComponent(background)})`}}>
                    //     {/* <img className={styles.img} src={`${BASE_URL_MEDIA}/${flashcard.image}`} alt="Card image" /> */}
                    // </div>
                    : null
                }
            </div>
            <div className={`${styles.btn}`}>
                <button onClick={() => handleSpeak(flashcard?.question, flashcard.questionLang)} type="button" className="btn rounded-pill btn-icon ">
                    <span className="bx bx-volume-full"></span>
                </button>
                <button onClick={() => handleSave(flashcard?.flashcardId)} type="button" className="btn rounded-pill btn-icon ">
                    <span className="bx bx-bookmark"></span>
                </button>
            </div>
        </div>
    )
}