import React from "react";
const FileUpload = ({ value, setFormData, formData, name, label }) => {
  const handleUpload = ({ target: { files } }) => {
    const imageExtensions = ["jpeg", "jpg", "png"];
    const excelExtensions = ["xlsx", "xls"];
    if (files[0]) {
      const fileExtension = files[0].name.split(".").pop().toLowerCase();
      if ((name === "medical_license" || name === "profile_image") && imageExtensions.includes(fileExtension)) {
        const updatedFormDetails = { ...formData };
        updatedFormDetails[name] = files[0];
        setFormData(updatedFormDetails);
      } else if ((name === "product_stock" || name === "lens_stock") && excelExtensions.includes(fileExtension)) {
        const updatedFormDetails = { ...formData };
        updatedFormDetails[name] = files[0];
        setFormData(updatedFormDetails);
      } else {
        alert("Please upload a correct file");
      }
    }
  };
  return (
    <div className="file-upload">
      <span className="file-name">{value ? (typeof value === "string" ? value : value?.name) : ""} </span>
      <div className="upload-btn">
        <input type="file" value={""} onChange={handleUpload} />
        <span onClick={handleUpload}>{label}</span>
      </div>
    </div>
  );
};

export default FileUpload;
