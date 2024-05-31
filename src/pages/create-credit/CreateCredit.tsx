import { yupResolver } from '@hookform/resolvers/yup';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { DialogContent, DialogTitle, IconButton } from "@mui/material";
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { SxProps } from '@mui/system';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import * as Yup from 'yup';
import BoxCreateCard from '~/components/BoxCreateCard/BoxCreateCard';
import { BootstrapDialog, fabGreenStyle } from '~/components/Common';
import Loading from '~/components/Loading/Index';
import { useAppSelector } from "~/redux/hook";
import { inforUser } from "~/redux/slices/authSlice";
import { Post } from '~/services/axios';
import { ICategory } from '~/types/ICategory';
import { CheckResponseSuccess, TEMPLATE_CREATE_CREDIT } from '~/utils/common';
import NotFound from '../notfound/NotFound';
import styles from './CreateCredit.module.scss';

const INIT_VALUE = {
    name: "",
    description: "",
    flashcardDTOs: [
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        },
        {
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        }
    ]
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function CreateCredit() {
    const userData = useAppSelector(inforUser);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [showNotFound, setShowNotFound] = useState(false);
    const [open, setOpen] = useState(false);

    const { id } = useParams();
    const [personName, setPersonName] = useState<string[]>([]);
    const [listCategory, setListCategory] = useState<ICategory[]>([]);
    const [listCategorySelected, setListCategorySelected] = useState<string[]>([]);
    // const [isEdit, setIsEdit] = useState(false);

    const validFileExtensions:any = { image: ['jpg', 'gif', 'png', 'jpeg', 'svg', 'webp'] };

    function isValidFileType(fileList:any, fileType:any) {
        if(!fileList?.length) return true;
        let file = fileList[0];
        let fileName = file?.name.toLowerCase();
        return fileName && validFileExtensions[fileType].indexOf(fileName.split('.').pop()) > -1;
    }

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Hãy nhập tên bộ thẻ').max(100, 'Tên bộ thẻ không được vượt quá 100 kí tự'),
        description: Yup.string().required('Hãy nhập mô tả của bộ thẻ').max(2000, 'Tên bộ thẻ không được vượt quá 2000 kí tự'),
        flashcardDTOs: Yup.array().of(
            Yup.object().shape({
                flashcardId: Yup.string().nullable('Allow null'),
                answer: Yup.string().required('Hãy nhập định nghĩa'),
                question: Yup.string().required('Hãy nhập thuật ngữ'),
                answerLang: Yup.string(),
                questionLang: Yup.string(),
                imageLink: Yup.string().nullable('Allow null'),
                imageFile: Yup.mixed().nullable('Allow null').test("is-valid-type", "Định dạng file không hợp lệ",
                (value:any) => isValidFileType(value , "image"))
              })
            ).min(1, `Bộ thẻ phải chứa ít nhất một thẻ flashcard`)
    });

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        getValues,
        setValue,
        formState: { errors }
      } = useForm({
        defaultValues: INIT_VALUE,
        mode: "onChange",
        resolver: yupResolver(validationSchema)
      });

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormContext)
        name: "flashcardDTOs", // unique name for your Field Array
    });

    useEffect(() => {
        getAllCategory();
    }, []);

    useEffect(() => {
        if (id) {
            getInfoCredit(id);
            getListFlashcard(id);
        }
    }, [id]);

    const getInfoCredit = async (id:any) => {
        setIsLoading(true);
        await Post(
            "/api/Credit/get-credit-by-id", 
            id, 
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let credit = res?.returnObj;
                if (credit) {
                    setValue('name', credit.name);
                    setValue('description', credit.description);
                        
                    let listCategoryId = credit.categories.map((cate:any) => cate.categoryId);
                    setListCategorySelected(listCategoryId);
                    // setCredit(credit);
                    // setIsLearned(credit.isLearned);
                    setShowNotFound(false);
                    // setIsEdit(true);
                }
                else {
                    setShowNotFound(true);
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

    const getListFlashcard = async (id:any) => {
        let listFlashcards:any = [];
        await Post(
            "/api/Flashcard/get-flashcard-by-creditid", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0,
                username: userData?.username,
                containerId: id
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let flashcards = res?.returnObj;
                if (flashcards) {
                    console.log(flashcards)
                    listFlashcards = flashcards;
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                    let listFlashCardDTO = flashcards.map((card:any) => {
                        return {
                            flashcardId: card.flashcardId,
                            question: card.question,
                            answer: card.answer,
                            answerLang: card.answerLang,
                            questionLang: card.questionLang,
                            imageLink: card.image,
                            imageFile: null
                        }
                    })

                    setValue("flashcardDTOs", listFlashCardDTO);
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
        return listFlashcards;
    }; 

    const getAllCategory = async () => {
        setIsLoading(true);
        await Post(
            "/api/Category/get-all-active", 
            {
                // username: userData?.username,
                // creditId: creditId
                pageSize: 1000,
                pageIndex: 0
            }, 
            // userData?.token ?? ""
        ).then((res) => {
            if(CheckResponseSuccess(res)) {
                let categories = res?.returnObj?.listResult;
                setListCategory(categories);
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
    }
  
    const handleChange = (event: SelectChangeEvent<typeof listCategorySelected>) => {
      const {
        target: { value },
      } = event;
      setListCategorySelected(
        // On autofill we get a stringified value.
        typeof value === 'string' ? value.split(',') : value,
      );
    };

    const handleUploadFile = async (e:any) => {
        if (!e.target.files || e.target.files.length === 0) {
            // setSelectedFile(undefined)
            return
        }


        // I've kept this example simple by using the first image instead of multiple
        // setSelectedFile(e.target.files[0])

        const formData = new FormData();
        formData.append('fileImport', e.target.files[0]);
        
        setIsLoading(true);
        await Post(
            "/api/Credit/import-file-flashcard", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res) && res?.returnObj != "ERROR") {
                let listFlashcard = res?.returnObj;
                Swal.fire({
                    icon: "success",
                    title: "Import dữ liệu thành công",
                    showConfirmButton: false,
                    timer: 600,
                });

                if (listFlashcard) {
                    console.log(listFlashcard)
                    // setListFlashcard(flashcards);
                    // setCurrentCard(flashcards[0]);
                    // setCurrentIndex(0)
                    listFlashcard.forEach((card:any) => {
                        append(
                            {
                                flashcardId: card.flashcardId,
                                question: card.question,
                                answer: card.answer,
                                // answerLang: card.answerLang,
                                // questionLang: card.questionLang,
                                // imageLink: card.image,
                                imageFile: null
                            }
                        )
                        return 
                    })
                    
                    // toast.success('Tạo bộ thẻ thành công');
                    // setValue("flashcardDTOs", listFlashCardDTO);
                }

                setOpen(false);
            }
            else {
                Swal.fire({
                    title: "Nhập bộ thẻ không thành công",
                    text: "Điều này có thể xảy ra vì bạn đã tải lên file hoặc định dạng file không hợp lệ. Hãy kiểm tra file của bạn và thử lại",
                    icon: "error",
                    // showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    // cancelButtonColor: "#d33",
                    // cancelButtonText: "Hủy",
                    confirmButtonText: "Đóng"
                })
                setOpen(false);
            }
        })
        .catch((err) => {
            toast.error("Đã có lỗi xảy ra.");
            console.log(err);
        })
        setIsLoading(false);
    }


    const onSubmit = async (data:any) => {
        setIsLoading(true);

        // await call api create
        let listFlashcard = data.flashcardDTOs.map((card:any) => {
            return {
                ...card, 
                imageFile: card?.imageFile ? card.imageFile?.[0] : null//demoFile
            }
        })

        data.flashcardDTOs = listFlashcard;
        const formData = new FormData();
        formData.append('creditReqDTO[name]', data.name);
        formData.append('creditReqDTO[description]', data.description);
        listCategorySelected.forEach((categoryId, index) => {
            formData.append(`creditReqDTO[categoryId][${index}]`, categoryId)
        })

        listFlashcard.forEach((card:any, index:number) => {
            formData.append(`creditReqDTO[flashcardDTOs][${index}][orderIndex]`, String(index))
            formData.append(`creditReqDTO[flashcardDTOs][${index}][flashcardId]`, card.flashcardId ?? '')
            formData.append(`creditReqDTO[flashcardDTOs][${index}][question]`, card.question)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][answer]`, card.answer)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][answerLang]`, card.answerLang)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][questionLang]`, card.questionLang)
            formData.append(`creditReqDTO[flashcardDTOs][${index}][imageFile]`, card.imageFile)

            let hasImage = card?.imageFile ? 'Y' : 'N';
            formData.append(`creditReqDTO[flashcardDTOs][${index}][hasImage]`, hasImage)
            formData.append(`listFile`, card.imageFile)
        });
        
        if (id) {
            formData.append('creditReqDTO[creditId]', id);
            await fetchAPIEdit(formData);
        } 
        else {
            await fetchAPICreate(formData)
        }

        setIsLoading(false);
        
      };

    const fetchAPICreate = async (formData:any) => {
        await Post(
            "/api/Credit/create-credit", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let creditId = res?.returnObj;
                // toast.success('Tạo bộ thẻ thành công');
                Swal.fire({
                    icon: "success",
                    title: "Tạo bộ thẻ thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/credit/${creditId}`);
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

    const fetchAPIEdit = async (formData:any) => {

        console.log(formData);
        await Post(
            "/api/Credit/edit-credit", 
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(async (res) => {
            if(CheckResponseSuccess(res)) {
                let creditId = res?.returnObj;
                // toast.success('Tạo bộ thẻ thành công');
                Swal.fire({
                    icon: "success",
                    title: "cập nhật bộ thẻ thành công",
                    showConfirmButton: false,
                    timer: 600,
                  });
                navigate(`/credit/${id}`);
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

    const handleAppend = () => {
        append({
            flashcardId: null,
            question: "",
            answer: "",
            answerLang: "",
            questionLang: "",
            imageLink: "",
            imageFile: null,
        });
    }


    if (showNotFound) {
        return (
            <>
                {isLoading ? null : <NotFound />}
                <Loading isLoading={isLoading}/>
                <ToastContainer />
            </>
        )
    }

    return (
        <>
            <Loading isLoading={isLoading}/>
            <ToastContainer />

            <div className={`container-xxl flex-grow-1 container-p-y px-5`}>
                <div className={styles.title}>
                    <h4 className={styles.name}>
                        {id ? "Chỉnh sửa bộ thẻ" : "Tạo bộ thẻ mới"}
                    </h4>
                    <div>
                        <button className='btn btn-info mx-2' onClick={() => setOpen(true)}>Nhập từ file</button>
                        <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Lưu</button>
                    </div>
                </div>

                <BootstrapDialog
                    onClose={() => setOpen(false)}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    maxWidth={'sm'}
                    fullWidth={true}
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        Nhập bộ thẻ từ file
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <DialogContent dividers>
                        <div className={` ${styles.import_container}  d-flex justify-content-between row g-0 mb-5`}>
                            <div className={styles.content}>
                                Tải file của bạn lên để tạo bộ thẻ từ file excel một cách nhanh chóng và hiệu quả. 
                                Hãy lưu ý rằng bộ thẻ của bạn phải có định dạng như file mẫu dưới đây
                            </div>
                            <a className={styles.link_template} href={TEMPLATE_CREATE_CREDIT}>
                                Tải file mẫu
                            </a>
                        </div>

                        <div className={styles.btn_upload}>
                            <label htmlFor={`import_file`} className='btn btn-primary'>
                                Chọn file
                            </label>
                            <input 
                                type="file" 
                                style={{display: 'none'}} 
                                name='import_file'
                                id='import_file'
                                // value={}
                                onChange={(e) => handleUploadFile(e)}
                            />
                        </div>
                    </DialogContent>


                    
                </BootstrapDialog>

                <form id="formCreate" className="mb-3" method="POST">

                    {/* Input Credit */}
                    <div className="card p-2">

                        <div className={styles.form_credit}>
                            <TextField
                                required
                                id="name"
                                // name="loginName"
                                label="Nhập tên bộ thẻ"
                                fullWidth
                                margin="dense"
                                variant="outlined" 
                                autoFocus
                                size="small"
                                {...register('name')}
                                error={errors.name ? true : false}
                                helperText={errors.name ? errors.name?.message : ""}
                            />

                            <TextField
                                required
                                id="loginName"
                                // name="loginName"
                                label="Thêm mô tả ..."
                                fullWidth
                                margin="dense"
                                variant="outlined" 
                                size="small"
                                multiline
                                maxRows={4}
                                minRows={3}
                                {...register('description')}
                                error={errors.description ? true : false}
                                helperText={errors.description ? errors.description?.message : ""}
                            />

                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="demo-multiple-chip-label">Thể loại</InputLabel>
                                <Select
                                    labelId="demo-multiple-chip-label"
                                    id="demo-multiple-chip"
                                    multiple
                                    value={listCategorySelected}
                                    onChange={handleChange}
                                    input={<OutlinedInput id="select-multiple-chip" label="Thể loại" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => (
                                                <Chip key={value} label={listCategory.find(item => item.categoryId == value)?.name} />
                                            ))}
                                        </Box>
                                    )}
                                    MenuProps={MenuProps}
                                >
                                    
                                    {listCategory.map((cate) => (
                                        <MenuItem key={cate.categoryId} value={cate.categoryId}>
                                            <Checkbox checked={!!listCategorySelected.find(item => item == cate.categoryId)} />
                                            <ListItemText primary={cate.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                    </div>
                    {errors.flashcardDTOs ? 
                    <div className={styles.list_error}>
                        <div style={{color: '#d32f2f', textAlign: 'center'}}>{errors.flashcardDTOs ? errors.flashcardDTOs?.message : ""}</div>
                        <div style={{color: '#d32f2f', textAlign: 'center'}}>{errors.flashcardDTOs?.root ? errors.flashcardDTOs?.root?.message : ""}</div>
                    </div> : null}


                    {/* Input FlashCard */}
                    <div className={styles.form_card}>
                        {fields.map((card, index) => {
                            return (
                                <BoxCreateCard 
                                    key={card.id} 
                                    item={card} 
                                    register={register}
                                    ordinal={index}
                                    getValues={getValues}
                                    setValue={setValue}
                                    errors={errors}
                                    remove={remove}
                                    previewInit={card?.imageLink ?? ""}
                                />
                            )
                        })}
                    </div>

                    {/* btn cộng thẻ  */}
                    <div className='d-flex justify-content-center'>
                        <Fab onClick={handleAppend} sx={{...fabGreenStyle } as SxProps} color="inherit" variant="extended">
                            <AddIcon sx={{ mr: 1 }} />
                            Thêm thẻ
                        </Fab>
                    </div>

                    <div className="d-flex justify-content-sm-end">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit(onSubmit)}>Lưu</button>
                        
                    </div>    
                </form>
            </div>
        </>
    )
};
