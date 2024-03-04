import './ContactCard.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import * as formik from 'formik';
import {ErrorMessage} from 'formik';
import * as yup from 'yup';
import { useState } from 'react';

const ContactCard = () => {

    const [showResults, setResults] = useState(false);
    const [myData, setMyData] = useState('');

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
      
    const monthOptions = _.range(1, 12 + 1).map(value => (
        <option key={value} value={value}>{monthNames[value - 1]}</option>
    ));


    const { Formik } = formik;

    const schema = yup.object().shape({
        full_name: yup.string().required(),
        contact_number: yup.string().required(),
        day: yup.string().required(),
        month: yup.string().required(),
        year: yup.string().required(),
        email: yup.string().required(),
        password: yup.string().required(),
        confirm_password: yup.string().required(),
    });

    const submitForm = (formData) => {
        
        const valid = validateAndFormat(formData);

        const apiurl = 'https://fullstack-test-navy.vercel.app/api/users/create';

        if(valid.pass) {
            // concat birthday
            const dob = formData.day +'-'+ formData.month +'-'+ formData.year;
            formData['date_of_birth'] = dob;

            delete formData.day;
            delete formData.month;
            delete formData.year;

            // final sumbit
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            };
            fetch(apiurl, requestOptions)
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    setResults(true);
                    setMyData(data.title);

                });
        }else {
            console.log('you failed to properly enter information for: '+valid.item+'. --'+valid.msg);
            setResults(false);
            setMyData('Error');

            console.log(showResults, myData)
        }

    }

    const isValidCanadianPhoneNumber = (phoneNumber) => {
        const regex = /^(1-?)?(\([0-9]{3}\)|[0-9]{3})[-. ]?[0-9]{3}[-. ]?[0-9]{4}$/;
        return regex.test(phoneNumber);
    }
    const isValidPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return regex.test(password);
    }

    const validateAndFormat = (formData) => {

        // validate name
        if(formData.full_name === '') {
            return {pass: false, item: 'full_name', msg: 'item is blank'};
        }

        // validate contact & canadian format
        if(formData.contact_number === '') {
            return {pass: false, item: 'contact_number', msg: 'item is blank'};
        } else {
            if(!isValidCanadianPhoneNumber(formData.contact_number)) {
                return {pass: false, item: 'contact_number', msg: 'number is not valid Canadian number'};
            }
        }

        // validate email
        if(formData.email === '') {
            return {pass: false, item: 'email', msg: 'item is blank'};
        }

        // validate D M Y
        if(formData.day === '' || formData.month === '' || formData.year === '') {
            return {pass: false, item: 'day month year', msg: 'an item is blank'};
        }

        // validate password matches confirm
        if(formData.password === '') {
            return {pass: false, item: 'password', msg: 'item is blank'};
        } else {
            if(!isValidPassword(formData.password)) {
                return {pass: false, item: 'password', msg: 'item is not valid'};
            }

            if(formData.password !== formData.confirm_password) {
                return {pass: false, item: 'cconfirm_password', msg: 'item is not a match'};
            }
        }

        return {pass: true, item: 'na', msg: 'valid'};
    }

    return (
        <>
            <div className="content">
                <div className="contact">
                    <h4>Create User Account</h4>
    
                    <Formik
                        validationSchema={schema}
                        onSubmit={submitForm}
                        initialValues={{
                            full_name: 'Andrew Phillips',
                            contact_number: '9056210870',
                            day: '',
                            month: '',
                            year: '',
                            email: '',
                            password: '',
                            confirm_password: '',
                        }}
                        >
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form noValidate onSubmit={handleSubmit}>
                                <div className="card-inner">
                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="12" controlId="validationFormik01">
                                            <Form.Label>Full Name</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput1"
                                                label="Full Name"
                                                className="mb-3"
                                                >
                                                <Form.Control 
                                                    type="text" 
                                                    name="full_name"
                                                    value={values.full_name}
                                                    placeholder="Full Name *"
                                                    onChange={handleChange}
                                                    isValid={touched.full_name && !errors.full_name}
                                                    className={errors.full_name ? 'invalid' : null}
                                                />
                                            </FloatingLabel> 
                                            {errors.full_name && touched.full_name ? ( <div className="err-msg">{errors.full_name}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="12" controlId="validationFormik02">
                                            <Form.Label>Contact Number</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput2"
                                                label="Contact Number"
                                                className="mb-3"
                                                >
                                                <Form.Control 
                                                    type="phone" 
                                                    name="contact_number"
                                                    value={values.contact_number}
                                                    placeholder="Contact Number *"
                                                    onChange={handleChange}
                                                    isValid={touched.contact_number && !errors.contact_number}
                                                    className={errors.contact_number ? 'invalid' : null}
                                                />
                                            </FloatingLabel> 
                                            {errors.contact_number && touched.contact_number ? ( <div className="err-msg">{errors.contact_number}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="4" controlId="validationFormik03" className='dmy'>
                                            <Form.Label>Birthdate</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput3"
                                                label="Day"
                                                className="mb-3"
                                                >
                                                <Form.Select 
                                                    aria-label="Day"
                                                    name="day"
                                                    value={values.day}
                                                    placeholder="Day *"
                                                    onChange={handleChange}
                                                    isValid={touched.day && !errors.day}
                                                    className={errors.day ? 'invalid' : null}
                                                    >
                                                        { _.range(1, 31 + 1).map(value => <option key={value} value={value}>{value}</option>) }
                                                </Form.Select>
                                            </FloatingLabel> 
                                            {errors.day && touched.day ? ( <div className="err-msg">{errors.day}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationFormik04" className='dmy'>
                                            <Form.Label><span style={{opacity:0}}>_</span></Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput4"
                                                label="Month"
                                                className="mb-1"
                                                >
                                                <Form.Select 
                                                    aria-label="Month"
                                                    name="month"
                                                    value={values.month}
                                                    placeholder="Month *"
                                                    onChange={handleChange}
                                                    isValid={touched.month && !errors.month}
                                                    className={errors.month ? 'invalid' : null}
                                                    >
                                                        { monthOptions }
                                                </Form.Select>
                                            </FloatingLabel> 
                                            {errors.month && touched.month ? ( <div className="err-msg" style={{'margin-top': '6px'}}>{errors.month}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group as={Col} md="4" controlId="validationFormik05" className='dmy'>
                                            <Form.Label><span style={{opacity:0}}>_</span></Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput5"
                                                label="Year"
                                                className="mb-1"
                                                >
                                                <Form.Select 
                                                    aria-label="Year"
                                                    name="year"
                                                    value={values.year}
                                                    placeholder="Year *"
                                                    onChange={handleChange}
                                                    isValid={touched.year && !errors.year}
                                                    className={errors.year ? 'invalid' : null}
                                                    >
                                                        { _.range(2024, 1924 + 1).map(value => <option key={value} value={value}>{value}</option>) }
                                                </Form.Select>
                                            </FloatingLabel> 
                                            {errors.year && touched.year ? ( <div className="err-msg" style={{'margin-top': '6px'}}>{errors.year}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="12" controlId="validationFormik06">
                                            <Form.Label>Email Address</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput6"
                                                label="Email Address"
                                                className="mb-3"
                                                >
                                                <Form.Control 
                                                    type="email" 
                                                    name="email"
                                                    value={values.email}
                                                    placeholder="Email Address *"
                                                    onChange={handleChange}
                                                    isValid={touched.email && !errors.email}
                                                    className={errors.email ? 'invalid' : null}
                                                />
                                            </FloatingLabel> 
                                            {errors.email && touched.email ? ( <div className="err-msg">{errors.email}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="12" controlId="validationFormik07">
                                            <Form.Label>Password</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput7"
                                                label="Password"
                                                className="mb-3"
                                                >
                                                <Form.Control 
                                                    type="password" 
                                                    name="password"
                                                    value={values.password}
                                                    placeholder="Password *"
                                                    onChange={handleChange}
                                                    isValid={touched.password && !errors.password}
                                                    className={errors.password ? 'invalid' : null}
                                                />
                                            </FloatingLabel> 
                                            {errors.password && touched.password ? ( <div className="err-msg">{errors.password}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    <Row className="mb-1">
                                        <Form.Group as={Col} md="12" controlId="validationFormik08">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <FloatingLabel
                                                required
                                                controlId="floatingInput8"
                                                label="Confirm Password"
                                                className="mb-3"
                                                >
                                                <Form.Control 
                                                    type="password" 
                                                    name="confirm_password"
                                                    value={values.confirm_password}
                                                    placeholder="Confirm Password *"
                                                    onChange={handleChange}
                                                    isValid={touched.confirm_password && !errors.confirm_password}
                                                    className={errors.confirm_password ? 'invalid' : null}
                                                />
                                            </FloatingLabel> 
                                            {errors.confirm_password && touched.confirm_password ? ( <div className="err-msg">{errors.confirm_password}</div>) : null}
                                            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                        </Form.Group>
                                    </Row>

                                    { showResults ? 
                                        <>
                                        <div id="results" className={myData}>
                                            { myData === 'Success' ? 
                                                (
                                                    <div>
                                                        <span className="material-symbols-outlined">check_circle</span>
                                                        <p>User account successfully created.</p>
                                                    </div>
                                                ) :
                                                (
                                                    <div>
                                                        <span className="material-symbols-outlined">cancel</span>
                                                        <p>There was an error creating the account.</p>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        </>
                                        :
                                        null
                                    }
                                </div>

                                <div className="form-buttons">
                                    <Button variant="outline-primary" type="cancel" className="bg-custom-button-alt">Cancel</Button>
                                    <Button type="submit" className="bg-custom-button">Submit</Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div> 
        </>
    )
}

export default ContactCard;