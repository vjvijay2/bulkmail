import { useState } from "react";
import axios from 'axios';
import * as XLSX from "xlsx"


function App() {

  const [msg, setmsg] = useState("")

  const [status, setstatus] = useState(false)

  const [emailList, setemaillist] = useState([])


  function handlechange(evt) {
    setmsg(evt.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = function (event) {
      try {
        const arrayBuffer = event.target.result;
        const data = new Uint8Array(arrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
        const totalemail = emaillist.map(function (item) { return item.A });
        console.log(totalemail);
        setemaillist(totalemail);
      }catch (error) {
        console.error("Error reading file:", error);
        alert("Error reading file. Please ensure it is a valid Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);  // Updated line
  }


  function send() {
    setstatus(true)
    axios.post("http://localhost:5000/sendemail", { msg: msg, emailList: emailList })
      .then(function (data) {
        if (data.data === true) {
          alert("Email send succesfully")
          setstatus(false)
        }
        else {
          alert("failed")

        }
      })
  }

  return (
    <>
      <div className="bg-blue-950 text-white text-center " >
        <h1 className="text-2xl font-medium px-5 py-3">Bulkmail</h1>
      </div>
      <div className="bg-blue-800 text-white text-center " >
        <h1 className="font-medium px-5 py-3">We can help your business with sending multilple emails at once</h1>
      </div>
      <div className="bg-blue-600 text-white text-center " >
        <h1 className="text-2xl font-medium px-5 py-3">Drag and Drop</h1>
      </div>
      <div className="bg-blue-400 text-black flex flex-col items-center px-5 py-3 ">
        <textarea onChange={handlechange} value={msg} className="w-[80%] h-32 py-2 outline-none border border-rounded rounded-md px-2 " placeholder="Enter The Email Text..."></textarea>
        <div>
          <input type="file" onChange={handlefile} className="border-4 border-dashed py-4 px-4 mt-5 mb-5" />
        </div>
        <p>Total Emails:{emailList.length}</p>
        <button onClick={send} className="bg-blue-950 text-white px-2 py-2 font-medium rounded-md w-fit mt-2">{status ? "Sending..." : "Send"}</button>
      </div>
      <div className="bg-blue-300 text-white text-center p-8 " >
      </div>
      <div className="bg-blue-200 text-white text-center p-8 " >
      </div>


    </>
  )

}
export default App;