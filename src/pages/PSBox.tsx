
import { useEffect, useRef, useState } from 'react'
import '../home.css'
import { Badge, Card, Container, ProgressBar } from "react-bootstrap"
import axios from "axios"
import { useSearchParams } from 'react-router'
import numeral from 'numeral'


export default function PSBox({ userInfo }: { userInfo: any }) {
    console.log(userInfo)
    const [formData, setFormData] = useState({
        dateFrom: "",
        dateTo: "",
    })

    const [isSearching, setIsSearching] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [isSearchingD1, setIsSearchingD1] = useState(false)
    const [theMachine, setTheMachine] = useState('')
    const [lineCode, setLineCode] = useState('')
    const [searchParam] = useSearchParams();

    const refInputDate1 = useRef(null)
    const refInputDate2 = useRef(null)


    function handleChange(e: any) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const [rowData, setRowData] = useState({ data: [] })
    const [rowDataDetail1, setRowDataDetail1] = useState({ data: [] })

    function handleClickSearch() {
        setLineCode('')
        const params = new URLSearchParams(formData).toString()
        setIsSearching(true)
        setRowDataDetail1({
            data: []
        })
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/engtrial/report2?' + params + '&customer=' + theMachine)
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
        // atur freeze first row
        let aTable = document.getElementById('mainTable')
        let aTable1 = document.getElementById('detailTable1')
        let aStack1 = document.getElementById('stack1')
        if (aTable && aStack1 && aTable1) {
            aTable.style.cssText = `height: ${window.innerHeight
                - aStack1.offsetHeight
                - 175
                }px`
            aTable1.style.cssText = `height: ${window.innerHeight
                - aStack1.offsetHeight
                - 175
                }px`
        }

        // atur cache
        if (searchParam.get('customer') ?? '' != '') {
            localStorage.setItem('ed_machine', searchParam.get('customer') ?? '')
            setTheMachine(localStorage.getItem('ed_machine') ?? '')
        } else {
            // kalau ga ada param pakai dari nilai valid terakhir
            if (localStorage.getItem('ed_machine')) {
                setTheMachine(localStorage.getItem('ed_machine') ?? '')
            }
        }

    }, [])

    function handleClickMainView(data: any) {
        setLineCode(data.line)
        const params = new URLSearchParams(formData).toString()
        setIsSearchingD1(true)
        axios.get(import.meta.env.VITE_APP_ENDPOINT + '/engtrial/reportd2?' + params + '&customer=' + theMachine
            + '&lineCode=' + data.line
            + '&ps=' + data.ps)
            .then((response) => {
                setIsSearchingD1(false)
                const datanya = response.data.data
                setRowDataDetail1({
                    data: datanya
                })


            }).catch(() => {
                setIsSearchingD1(false)
            })
    }

    const saveBlob = (function () {
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute('style', "display: none");
        return function (blob: any, fileName: any) {
            var url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = fileName;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }());

    function handleClickExport() {
        const params = new URLSearchParams(formData).toString()
        setIsExporting(true)
        if (confirm('Are you sure want to export the data ?')) {
            axios({
                url: import.meta.env.VITE_APP_ENDPOINT + '/engtrial/report2-to-spreadsheet?' + params + '&customer=' + theMachine,
                method: 'GET',
                responseType: 'blob',
            }).then(response => {
                setIsExporting(false)
                saveBlob(response.data, `PS Rating Logs from ${formData.dateFrom} to ${formData.dateTo} .xlsx`)
            }).catch(error => {
                console.log(error)
                setIsExporting(false)
            })
        }
    }

    return (
        <Container fluid>
            <form>
                <div className="row mt-3" id="stack1">
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-1">
                            <span className="input-group-text" >Customer</span>
                            <input type="text" className="form-control" value={theMachine ?? ''} readOnly disabled />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group input-group-sm mb-3">
                            <span className="input-group-text" > Period from</span>
                            <input type="date" className="form-control" name="dateFrom" onChange={handleChange} ref={refInputDate1} />
                            <span className="input-group-text" >To</span>
                            <input type="date" className="form-control" name="dateTo" onChange={handleChange} ref={refInputDate2} />
                            <button type="button" className="btn btn-primary" disabled={isSearching} onClick={handleClickSearch}>Search</button>
                            <button type="button" className="btn btn-success" disabled={isExporting} onClick={handleClickExport}>Export</button>
                        </div>
                    </div>
                </div>
            </form>

            <div className="row">
                <div className="col-md-6 mb-1">
                    <Card>
                        <Card.Header>
                            <div className="d-flex">
                                <div className="me-auto p-2">Main View</div>
                                <div className="p-2"> {isSearching ? 'Please wait' : <Badge bg="info">{rowData.data.length > 0 ? rowData.data.length + ' rows found' : ''}</Badge>}</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Container fluid>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive" id="mainTable">
                                            <table className="table align-middle table-sm table-bordered table-hover" >
                                                <thead className="text-center table-light">
                                                    <tr className="first">
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
                                                                <td onClick={() => handleClickMainView({ line: item.txtline, ps: item.txtps })} title='See detail' style={{ cursor: 'pointer' }}>{item.txtline}</td>
                                                                <td>{item.txtps}</td>
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
                        </Card.Body>
                    </Card>
                </div>
                <div className="col-md-6 mb-1">
                    <Card>
                        <Card.Header>
                            <div className="d-flex">
                                <div className="me-auto p-2">Detail View 1 <Badge bg='info'>{lineCode}</Badge> </div>
                                <div className="p-2">.</div>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <Container fluid>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="table-responsive" id="detailTable1">
                                            <table className="table align-middle table-sm table-bordered table-hover" >
                                                <thead className="text-center table-light">
                                                    <tr className="first">
                                                        <th className="align-middle">Date</th>
                                                        <th className="align-middle">Line</th>
                                                        <th className="align-middle">Machine Number</th>
                                                        <th className="align-middle">Jig Number</th>
                                                        <th className="align-middle">Model</th>
                                                        <th className="align-middle">Check</th>
                                                        <th className="align-middle">Pass</th>
                                                        <th className="align-middle">Pass Rate</th>
                                                    </tr>
                                                </thead>
                                                <tbody className='text-center'>
                                                    {
                                                        isSearchingD1 ? <tr><td colSpan={16}>Please wait</td></tr> : rowDataDetail1.data.map((item: any, index) => {
                                                            return <tr key={index} className="font-monospace">
                                                                <td>{item.txttgl}</td>
                                                                <td>{item.txtline}</td>
                                                                <td>{item.txtps}</td>
                                                                <td>{item.txtjig}</td>
                                                                <td>{item.txtmodel}</td>
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
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </Container>
    )
}