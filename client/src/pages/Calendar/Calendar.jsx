import Axios from "axios";
import "./Calendar.css"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import { update } from "../../features/userSlice";
import { Button, Card, Container, Modal, Navbar, Form } from "react-bootstrap";
import { toast } from "react-toastify";
const moment = require('moment')

function Calendar(){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { loginTime_id, username, loginTime } = useSelector(state => state.user)

    const [isMonth, setIsMonth] = useState(true)
    const [isWeek, setIsWeek] = useState(false)
    const [isDay, setIsDay] = useState(false)

    const [email, setEmail] = useState('')
    const [date, setDate] = useState(moment().format('YYYY-MM-DD'))
    const [desc, setDesc] = useState('')

    const [currYear, setCurrYear] = useState(moment().get('year'))
    const [currMonth, setCurrMonth] = useState(moment().get('month'))
    // const [currWeek, setCurrWeek] = useState(moment().week)
    const [currDay, setCurrDay] = useState(moment().get('date'))

    const [prevMonth, setPrevMonth] = useState(moment().month(currMonth).get('month')-1)
    const [prevWeek, setPrevWeek] = useState(0)
    const [prevDay, setPrevDay] = useState(moment().get('date')-1)

    const [nextMonth, setNextMonth] = useState(moment().month(currMonth).get('month')+1)
    const [nextWeek, setNextWeek] = useState(0)
    const [nextDay, setNextDay] = useState(moment().get('date')+1)

    const [daysOfWeek, setDaysOfWeek] = useState(Array.from({ length: 7 }, (_, i) => moment().weekday(i).format('dddd')))
    const [daysOfMonth, setDaysOfMonth] = useState(moment().endOf('month').get('date'))
    const [monthOfYear, setMonthOfYear] = useState(moment().endOf('year').get('month')+1)
    const [listAgenda, setListAgenda] = useState([])

    function arrayOfDate(month, year){
        let date = []
        let totalDays = moment([year, month]).endOf('month').get('date')
        let countingDate = 1
        let week = []
        while(countingDate < totalDays + 1){
            if(moment([year, month, countingDate]).day() !== 0){
                if(week.length <= 0){
                    let prevYear = year
                    let prevMnth = month-1
                    if(month === 0) {
                        prevYear = prevYear - 1
                        prevMnth = 11
                    }
                    let prevTotalDays = moment([prevYear, prevMnth]).endOf('month').get('date')
                    let countPrevDate = prevTotalDays - moment([year, month, countingDate]).day() + 1;
                    while(week.length < moment([year, month, countingDate]).day()){
                        week.push(moment([prevYear, prevMnth, countPrevDate]).toDate())
                        countPrevDate = countPrevDate + 1
                    }
                }
                week.push(moment([year, month, countingDate]).toDate())
            } else {
                date.push(week)
                week = []
                week.push(moment([year, month, countingDate]).toDate())
            }
            countingDate = countingDate + 1
        }
        if(week.length > 0) {
            if(week.length < 7){
                let nxtYear = year
                let nxtMnth = month+1
                if(month === 11) {
                    nxtYear = nxtYear + 1
                    nxtMnth = 0
                }
                let countNextDate = 1
                while(week.length < 7){
                    week.push(moment([nxtYear, nxtMnth, countNextDate]).toDate())
                    countNextDate = countNextDate + 1
                }
            }
            date.push(week)
        }
        return date
    }

    let calendarTheMonth = arrayOfDate(currMonth, currYear)
    const [weeksOfMonth, setWeeksOfMonth] = useState(calendarTheMonth.length)
    const [calendarOfTheMonth, setCalendarOfTheMonth] = useState(calendarTheMonth)

    const Logout = async (e) => {
        e.preventDefault();
        try {
            // loginTime_id = JSON.parse(localStorage.getItem('authKey')).loginTime_id
            await Axios.post(`${API_URL}/logout/${loginTime_id}`, {
                loginTime_id
            })

            dispatch(update({
                username: '',
                user_id: '',
                token: '',
                loginTime_id: ''
            }))
            
            localStorage.removeItem("authKey")
            navigate('/login')
        } catch (error) {
            if(error.response){
                console.log(error.response.data)
            }
        }
    }

    // For Modal Operation
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleCreate = () => setShow(true);

    const Create = async (e) => {
        e.preventDefault()
        try {
            await Axios.post(`${API_URL}/send-email/create`, {
                email,
                date: moment(date).format('YYYY-MM-DD'),
                desc
            }).then(() => {
                toast.success("Send Email Successfully created!!");
                setShow(false)
            })
        } catch (error) {
            throw error
        }
    }

    const handleNext = async () => {
        if(isMonth){
            if(currMonth === 11){
                setCurrMonth(0)
                setCurrYear(currYear + 1)
                setCurrDay(moment([currYear, currMonth]).startOf('month').get('date'))
            } else {
                setCurrMonth(currMonth + 1)
                setCurrDay(moment([currYear, currMonth]).startOf('month').get('date'))
            }
        }
    }

    const handleBack = async () => {
        if(isMonth){
            if(currMonth === 0){
                setCurrMonth(11)
                setCurrYear(currYear-1)
                setCurrDay(moment([currYear, currMonth]).startOf('month').get('date'))
            } else {
                setCurrMonth(currMonth-1)
                setCurrDay(moment([currYear, currMonth]).startOf('month').get('date'))
            }
        }
    }

    const handleTodayDate = async () => {
        setCurrDay(moment().get('date'))
        setCurrMonth(moment().get('month'))
        setCurrYear(moment().get('year'))
    }

    useEffect(() => {
        let newCalendar = arrayOfDate(currMonth, currYear)
        setCalendarOfTheMonth(newCalendar)
        // async function fetchData(){
            Axios.get(`${API_URL}/send-email/all?start_date=${moment([currYear, currMonth]).startOf('month')}&end_date=${moment([currYear, currMonth]).endOf('month')}`)
            .then((response) => {
                let unfilteredAgenda = response.data.data
                let agendas = []
                let allDate = calendarOfTheMonth.flat()
                for (const date of allDate) {
                    console.log(date)
                    let theDate = moment(date)
                    let filterAgenda = unfilteredAgenda.filter(x => theDate.diff(moment(x.date).format('YYYY-MM-DD'), 'day') === 0)
                    console.log(theDate.diff(moment('2024-02-27'), 'day'))
                    console.log(filterAgenda)
                    agendas.push(filterAgenda)
                }
                setListAgenda(agendas)
            })
        // }
        // fetchData()
        console.log("list Agenda: ", listAgenda)
    }, [currMonth, currDay, currYear, show])

    return (
        <div>
            <Navbar expand="lg" variant="light" bg="light" className="justify-content-center align-items-center">
                <Container className="d-flex align-content-right">
                    <Navbar.Brand className="text-start mx-2">
                        <h1 className="text-bold">Agenda</h1>
                    </Navbar.Brand>
                    <div className="d-flex align-content-center">
                        <p className="p-2 fs-5">Hi, {username}</p>
                        <button className="btn btn-danger" onClick={Logout}>Logout</button>
                    </div>
                </Container>
            </Navbar>
            <div className="justify-content-center align-items-center px-5 py-3 mt-3" id="container">
                <div className="d-flex align-content-right mx-1">
                    <h1 className="col text-start text-light mx-2">Big Calendar</h1>
                    <Button className="col-2 mx-2 fs-5 px-3" onClick={handleCreate}>Create</Button>
                </div>
                <div className="d-flex row align-items-center my-3 mx-1">
                    <Button className="col mx-2 fs-5" onClick={handleTodayDate}>Today</Button>
                    <Button className="col mx-2 fs-5" onClick={handleBack}>Back</Button>
                    <Button className="col mx-2 fs-5" onClick={handleNext}>Next</Button>
                    <h2 className="col-4 mx-2 text-light">{moment().month(currMonth).format('MMMM')} {currYear}</h2>
                    <Button className="col mx-2 fs-5">Month</Button>
                    <Button className="col mx-2 fs-5">Week</Button>
                    <Button className="col mx-2 fs-5">Day</Button>
                    <Button className="col mx-2 fs-5">Agenda</Button>
                </div>
                <Card className="q-40 m5 p-2 rounded-5">
                    <Card.Body>
                        <div className="row px-3 py-3 align-items-center border-bottom border-black">
                            {daysOfWeek.map((day, index) => (
                                <div
                                    key={day}
                                    className="col mx-4 days-header"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="days-grid">
                        {calendarOfTheMonth.map((week, index) => (
                            <div key={week} className="row px-3 py-3 align-items-center">
                                {week.map((day, idx) => (
                                    moment(day).get('month') !== currMonth ? ( 
                                    <div key={day} className="col p-4 bg-secondary-subtle">
                                        <h3 className="d-flex justify-content-end mt-0 text-end text-body-secondary">{moment(day).get('date')}</h3>
                                        <div className="content text-wrap">
                                            <ul>
                                                { listAgenda[((index)*7)+idx]?.map((agnd) => (
                                                    <li key={agnd._id} className="fs-5 text-break">{agnd.email}</li>
                                                ))
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                    ): ( 
                                    <div key={day} className="col p-4">
                                        <h3 className="d-flex justify-content-end mt-0 text-end">{moment(day).get('date')}</h3>
                                        <div className="content text-wrap">
                                            <ul>
                                                { listAgenda[((index)*7)+idx]?.map((agnd) => (
                                                    <li key={agnd._id} className="fs-5 text-break">{agnd.email}</li>
                                                ))
                                                }
                                            </ul>
                                        </div>
                                    </div>)
                                ))}
                            </div>
                        ))}
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <Modal show={show} onHide={handleClose} className="p-6 create-modal">
				<Modal.Header closeButton className="m-3">
					<Modal.Title>CREATE SEND EMAIL</Modal.Title>
				</Modal.Header>
				<Modal.Body>
                    <Form onSubmit={Create} className="p-3">
                        <Form.Group className="mb-3" controlId="formUsername">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className="d-flex" type="email" placeholder="Enter username" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" min={moment().format("YYYY-MM-DD")} placeholder={moment().format('YYYY-MM-DD')} value={date} onChange={(e) => setDate(e.target.value)}/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formDesc">
                            <Form.Label>Desc</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Desc" value={desc} onChange={(e) => setDesc(e.target.value)}/>
                        </Form.Group>
                        <div className="d-flex flex-row-reverse">
                            <Button variant="primary" type="submit" className="col-3">
                                Submit
                            </Button>
                        </div>
                    </Form>
				</Modal.Body>
			</Modal>
        </div>
    )
}

export default Calendar