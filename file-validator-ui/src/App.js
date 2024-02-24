import React from "react";
import UploadForm from "./file-validaton/UploadForm";
import logo from "./assets/logo1.png";

function App() {
  return (
    <div className="App bg-none">
      <nav className=" h-16 bg-gray-100 p-2 ">
        <div className="">
        <img src={logo} alt="logo" className=" w-20 h-20 ml-5 fixed "></img>
        </div>
      </nav>
      <UploadForm />
    </div>
  );
}

export default App;
