
import { useEffect, useRef, useState } from 'react'
import '../home.css'
import { Badge, Container, ProgressBar } from "react-bootstrap"
import axios from "axios"
import { useSearchParams } from 'react-router'
import numeral from 'numeral'

export default function Home({ userInfo }: { userInfo: any }) {
    console.log(userInfo)
    const [formData, setFormData] = useState({
        dateFrom: "",
        dateTo: "",
    })

    const [isSearching, setIsSearching] = useState(false)
    const [theMachine, setTheMachine] = useState('')
    const [searchParam] = useSearchParams();

    const refInputDate1 = useRef(null)
    const refInputDate2 = useRef(null)


    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [rowData, setRowData] = useState({ data: [] })

    function handleClickSearch() {
        const params = new URLSearchParams(formData).toString()

        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/engtrial/report1?' + params + '&machineBrand=' + theMachine)
            .then((response) => {
                const datanya = response.data.data
                setRowData({
                    data: datanya
                })
                setIsSearching(false)

            }).catch(() => {
                setIsSearching(false)

            })
    }


    useEffect(() => {
        if (searchParam.get('machineBrand') ?? '' != '') {
            localStorage.setItem('ed_machine', searchParam.get('machineBrand') ?? '')
            setTheMachine(localStorage.getItem('ed_machine') ?? '')
        } else {
            // kalau ga ada param pakai dari nilai valid terakhir
            if (localStorage.getItem('ed_machine')) {
                setTheMachine(localStorage.getItem('ed_machine') ?? '')
            }
        }
    }, [])

    return (
        <Container fluid>
            <form>
                <div className="row mt-3" id="stack1">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" >Machine</span>
                            <input type="text" className="form-control" value={theMachine ?? ''} readOnly disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" > Period from</span>
                            <input type="date" className="form-control" name="dateFrom" onChange={handleChange} ref={refInputDate1} />
                            <span className="input-group-text" >To</span>
                            <input type="date" className="form-control" name="dateTo" onChange={handleChange} ref={refInputDate2} />
                            <button type="button" className="btn btn-primary" disabled={isSearching} onClick={handleClickSearch}>Search</button>
                        </div>
                    </div>
                </div>

                <div className="row" id="stack8">
                    <div className="col-md-4 mb-3">
                        <div className="btn-group btn-group-sm" role="group" aria-label="Basic example">

                        </div>
                    </div>
                    <div className="col-md-4 mb-3 text-center">

                    </div>
                    <div className="col-md-4 mb-3 text-end">
                        {isSearching ? '' : <Badge bg="info">{rowData.data.length > 0 ? rowData.data.length + ' rows found' : ''}</Badge>}
                    </div>
                </div>
            </form>

            <div className="row">
                <div className="col-md-12 mb-1">
                    <div className="table-responsive" id="coba">
                        <table className="table align-middle table-sm table-bordered table-hover" >
                            <thead className="text-center table-light">
                                <tr className="first">
                                    <th className="align-middle">Date</th>
                                    <th className="align-middle">Line</th>
                                    <th className="align-middle">Machine Number</th>
                                    <th className="align-middle">Check</th>
                                    <th className="align-middle">Pass</th>
                                    <th className="align-middle">Pass Rate</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    isSearching ? <tr><td colSpan={16}>Please wait</td></tr> : rowData.data.map((item: any, index) => {
                                        return <tr key={index} className="font-monospace">
                                            <td>{item.txttgl}</td>
                                            <td>{item.txtline}</td>
                                            <td>{item.txtict}</td>
                                            <td>{numeral(item.txtcheck).format(',')}</td>
                                            <td>{numeral(item.txtpass).format(',')}</td>
                                            <td><ProgressBar now={item.txtpercen} label={`${item.txtpercen}%`} /></td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Container>
    )
}