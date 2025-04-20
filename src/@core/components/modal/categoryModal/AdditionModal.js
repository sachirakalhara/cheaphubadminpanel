import React from "react"
import Modal from "../index"
import {Button, Col, FormFeedback, Input, Label, Row} from "reactstrap"
import {Controller} from "react-hook-form"
import "../styles.scss";
import ReactFilesMini from "../../../../custom-components/file-picker/ReactFiles-Mini";
import Cropper from "react-easy-crop";

const CROP_ASPECT_TO_FIRST_IMAGE = 1;

const AdditionModal = (props) => {
    const customStyle = (error) => ({
        control: styles => ({
            ...styles,
            borderColor: error ? '#EA5455' : styles.borderColor,
            '&:hover': {
                borderColor: error ? '#EA5455' : styles['&:hover'].borderColor
            }
        })
    })
    return (
        <Modal show={props.show} toggle={props.toggle} headTitle={props.isEditMode ? "Update Category" : "Add Category"}
               size={'lg'}>
            <Row tag='form' className='gy-1 pt-2' onSubmit={props.onSubmit}>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='name'>
                        Category Name
                    </Label>
                    <Controller
                        name='name'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='name' placeholder='Category Name' value={field.value}
                                   invalid={props.errors.name && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.name && <FormFeedback>Please enter a valid category name</FormFeedback>}
                </Col>
                <Col md={12} xs={12}>
                    <Label className='form-label mb-1' for='description'>
                        Category Description
                    </Label>
                    <Controller
                        name='description'
                        control={props.control}
                        render={({field}) => (
                            <Input {...field} id='description' placeholder='Category Description' value={field.value}
                                   type="textarea" rows='4'
                                   invalid={props.errors.description && true} autoComplete="off"/>
                        )}
                    />
                    {props.errors.description &&
                        <FormFeedback>Please enter a valid category description</FormFeedback>}
                </Col>

                <Col md={6} xs={12}>
                    <Label className="form-label mb-1" for="categoryImage">
                        Category Image <span style={{color: 'red'}}>*</span>
                    </Label>
                    <Controller
                        name="categoryImageName"
                        control={props.control}
                        render={({field}) => (
                            <ReactFilesMini
                                {...field}
                                id="categoryImageName"
                                sendImageData={async (imageFile, file) => {
                                    await props.handleChangeFileShare(file);
                                }}
                                invalid={props.errors.categoryImageName && true}
                                accepts={["image/png", "image/jpg", "image/jpeg"]}
                                imageFile={props.categoryImageName}
                                defaultImg={props.uploadedCategoryImage}
                            />
                        )}
                    />
                    {props.errors.categoryImageName && (
                        <span style={{fontSize: '12px', color: '#EA5455', marginTop: 4}}>
                            Please choose a category image
                        </span>
                    )}
                </Col>

                <Col md={12} lg={12} xs={12}>
                    <Row className="align-items-center">
                        <Col md={6} lg={6} xs={12}>
                            {props.categoryImageIsCropVisible && props.categoryImageSrc && (
                                <div>
                                    <div className="program-modal-image-cropper">
                                        <Cropper
                                            image={props.categoryImageSrc}
                                            crop={props.categoryImageCrop}
                                            aspect={CROP_ASPECT_TO_FIRST_IMAGE}
                                            zoom={props.categoryImageZoom}
                                            onCropChange={props.onCropChange}
                                            onCropComplete={props.onCropComplete}
                                        />
                                    </div>
                                    <div className="program-modal-image-cropper-controller">
                                        <input
                                            type="range"
                                            value={props.categoryImageZoom}
                                            min={1}
                                            max={3}
                                            step={0.1}
                                            onChange={props.onCropChangeHandle}
                                            className="zoom-range"
                                        />
                                    </div>
                                </div>
                            )}
                        </Col>

                        {props.categoryImageSrc && (
                            <Col lg={6} md={6} sm={12}>
                                <img
                                    src={props.categoryCroppedImage}
                                    style={{width: '50%'}}
                                    loading="lazy"
                                    className="program-modal-image-cropper-output"
                                    alt={'img'}/>
                            </Col>
                        )}
                    </Row>
                </Col>

                <Col xs={12} className='d-flex justify-content-end mt-2 pt-5'>
                    <Button type='submit' className='me-1' color='success'>
                        {props.isEditMode ? 'Update' : 'Submit'}
                    </Button>
                    <Button type='reset' color='secondary' outline onClick={props.toggle}>
                        Discard
                    </Button>
                </Col>
            </Row>
        </Modal>
    )
}

export default AdditionModal
