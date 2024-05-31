
export interface ICredit {
    avatar: string
    categories: any
    classes: any
    countFlashcard: number
    countLearn: number
    countLearnCal: number
    countReport: number
    createdAt: string
    createdBy: string
    creditId: string
    description: string
    flashcards: any
    folders: any
    name: string
    isLearned: boolean
    isReported: boolean
    countLearned: number
    countKnown: number
    countGood: number
}

export interface IPropsModal {
    data: any;
    callBackCheck:any;
    checked: boolean;
}

export interface IProps {
    credit: ICredit;
    showProgress: boolean;
}