import { useState, useEffect } from 'react';
import MuiGrid from '../../components/MuiGrid/MuiGrid';
import axios from 'axios';

export default function Home() {
    const newStudent = {
        id: '',
        fullName: "",
        marks: "",
        is_paid: false
    }
    const [data, setData] = useState([]);
    const [student, setStudent] = useState(newStudent);
    const [isEditMode, setIsEditMode] = useState(false);

    const [ids, setIds] = useState([]);

    const fetchData = async () => {
        const { data } = await axios.get('http://localhost:5000/api/students');
        setData(data.students);
        console.log(data.students);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const editHandler = (id) => {
        setIsEditMode(true);
        const student = data.find((student) => student._id === id);
        console.log(student);
        let currentStudent = {
            id: student._id,
            fullName: student.full_name,
            marks: student.marks,
            is_paid: student.is_paid
        }
        setStudent(currentStudent);
    }

    const columns = [
        { field: "id", headerName: "ID", width: 330, hide: true },
        { field: "full_name", headerName: "Full Name", width: 200 },
        { field: "marks", headerName: "Marks", width: 120 },
        {
            field: "is_paid", headerName: "Fee Paid", width: 120,
            renderCell: (params) => {
                return (
                    <div>
                        {params.value ? "Yes" : "No"}
                    </div>
                )
            }
        },
        {
            field: "pass_fail", headerName: "Pass/Fail", width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        {
                            (params.row.marks >= 60 && params.row.is_paid) ?
                                <span style={{ color: "green" }}>Pass</span> :
                                <span style={{ color: "red", fontWeight: 'bold' }}>Fail</span>
                        }
                    </div>
                )
            }
        },
        {
            field: "action", filterable: false, sortable: false,
            headerName: "Action",
            width: 140,
            renderCell: (params) => {
                return (
                    <button
                        className="text-white h-8 w-20 rounded-md bg-green-700"
                        onClick={() => editHandler(params.row.id)}>Edit</button>
                );
            },
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!student.fullName || !student.marks) {
            alert('All fields are required');
            return;
        }

        if (isEditMode) {
            const studentObj = {
                id: student.id,
                full_name: student.fullName,
                marks: student.marks,
                is_paid: student.is_paid
            }

            console.log(studentObj);
            await axios.put(`http://localhost:5000/api/students/${student.id}`, studentObj)
                .then(({ data }) => {
                    alert(data.message);
                }).catch(err => alert(err.response?.data?.message));

        } else {
            const studentObj = {
                full_name: student.fullName,
                marks: student.marks,
                is_paid: student.is_paid ? true : false,
            }

            // return console.log("studentObj", studentObj);
            await axios.post('http://localhost:5000/api/students', studentObj)
                .then(({ data }) => {
                    alert(data.message);
                }).catch(err => alert(err.response?.data?.message));
        }

        fetchData();
        setStudent(newStudent);
        setIsEditMode(false);

    };

    const onChangeValue = (e) => {
        setStudent({ ...student, is_paid: e.target.value });

        console.log(e.target.value);
        // setStudent({ ...student, is_paid: e.target.value });
    }

    const onChangeFullName = (e) => {
        const result = e.target.value.replace(/[^a-zA-Z ]/g, "");
        setStudent({ ...student, fullName: result });
    }

    const onChangeMarks = (e) => {
        const result = e.target.value.replace(/[^0-9]/g, "");
        if (result > 100) {
            setStudent({ ...student, marks: 100 });
        } else {
            setStudent({ ...student, marks: result });
        }
    }

    const onDeleteHandler = async () => {
        if (ids.length === 0) {
            alert('Please select at least one student');
            return;
        }

        await axios.put('http://localhost:5000/api/students', { ids })
            .then(({ data }) => {
                alert(data.message);
            }).catch(err => alert(err.response?.data?.message));

        fetchData();
    }

    return (
        <div className="">
            <div className="p-8 bg-gray-50">
                <form
                    onSubmit={handleSubmit}
                    className="">
                    <div className="flex">
                        <span className="w-36 text-right">Passing Marks:</span>
                        <span className="ml-5">60/100</span>
                    </div>
                    <div className="flex">
                        <span className="w-36 text-right">*Full Name:</span>
                        <input type="text" className="ml-5 border" required
                            value={student.fullName}
                            onChange={onChangeFullName} />
                    </div>
                    <div className="flex">
                        <span className="w-36 text-right">*Marks:</span>
                        <input type="number" className="ml-5 border" required
                            value={student.marks}
                            onChange={onChangeMarks} />
                    </div>
                    <div className="flex">
                        <span className="w-36 text-right">Fee Paid:</span>
                        <div >
                            <input
                                type="radio"
                                value={true}
                                onChange={onChangeValue}
                                checked={student.is_paid}
                                className="ml-5 mr-1" />Yes
                            <input
                                type="radio"
                                value={false}
                                onChange={onChangeValue}
                                checked={!student.is_paid}
                                className="ml-5 mr-1" />No
                        </div>
                    </div>
                    <div className="flex mt-5">
                        <span className="w-36 text-right"></span>
                        <button type='submit'
                            className="bg-slate-300 text-black px-10 ml-5 hover:bg-slate-500 ">Submit Data</button>
                    </div>
                </form>
            </div>

            <div className="p-8 w-9/12">
                <div className="flex  mb-5">
                    <span className="w-40"></span>
                    <button className="bg-slate-300 text-black px-10"
                        onClick={() => onDeleteHandler()}>Delete</button>
                </div>
                <div className="flex">
                    <span className="w-40"></span>
                    <MuiGrid data={data} columns={columns} setIds={setIds} />
                </div>
            </div>

        </div>
    )
}



