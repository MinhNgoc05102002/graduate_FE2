// export interface IFlashcard {
//     username: string
//     flashcardId: string
//     process: string
//     lastLearnedDate: string
//     recentWrongExam: boolean
//     recentWrongLearn: boolean
//     flashcard: {
//         flashcardId: string
//         question: string
//         answer: string
//         answerLang: string
//         questionLang: string
//         image: string
//         isDeleted: boolean
//         creditId: string
//     }
// }

export interface ILearn {
    username: string
    flashcardId: string
    process: string
    lastLearnedDate: string
    recentWrongExam: boolean
    recentWrongLearn: boolean
    countLearnedTrue: Number
}


export interface IFlashcard {
    flashcardId: string
    question: string
    answer: string
    answerLang: string
    questionLang: string
    image: string
    isDeleted: boolean
    creditId: string
    learns: ILearn[]|null
}

// export interface IListFlashcardProps {
//     flashcards: IFlashcard[];
// }

export interface IFlashcardProps {
    flashcard: IFlashcard;
}

