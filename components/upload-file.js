const fileLimit = 25000000;

const calculateTotalFileSize = (files) => {
 return Array.from(files).reduce((acc, file) => acc + file.size, 0);
};
const updateDropzoneFileList = (dropZoneElement, filesArr) => {
 let dropzoneFileMessage = dropZoneElement.querySelector(".file-info");
 if (!dropzoneFileMessage) return;

 const cutFileName = (name, maxLength) => {
  return name.length > maxLength ? name.substring(0, maxLength) + "..." : name;
 };
 const filesString = filesArr.reduce((acc, file) => {
  const cutedName = cutFileName(file.name, 22); // Limitar a 22 caracteres

  acc = acc + `<li>${cutedName}, ${file.size} bytes</li>\n`
  return acc;
 }, '');
 dropzoneFileMessage.innerHTML = `<ul>${filesString}</ul>`
};



const initializeWarrantyUploadFile = () => {


 const inputElement = document.getElementById("upload-file");
 const dropZoneElement = inputElement.closest(".dropzone-area");
 const btnSave = document.getElementById("btn-save");
 const btnCancel = document.getElementById("btn-cancel");
 if (inputElement && dropZoneElement && btnCancel && btnSave) {

  inputElement.addEventListener("change", (e) => {

   const filesArr = Array.from(inputElement.files);

   const totalSize = calculateTotalFileSize(filesArr);

   if (totalSize > fileLimit) {
    showToast({ message: 'File is over 25MB', type: 'warning' });
    alert("Files are over 25MB!");
    return
   }
   if (filesArr.length) {
    updateDropzoneFileList(dropZoneElement, filesArr);
   }
  });

  dropZoneElement.addEventListener("dragover", (e) => {
   e.preventDefault();
   dropZoneElement.classList.add("dropzone--over");
  });

  ["dragleave", "dragend"].forEach((type) => {
   dropZoneElement.addEventListener(type, (e) => {
    dropZoneElement.classList.remove("dropzone--over");
   });
  });

  btnCancel.addEventListener("click", (e) => {
   e.preventDefault();
   const dropzoneFileMessage = dropZoneElement.querySelector(".file-info");
   if (!dropzoneFileMessage) return;

   if (!inputElement.value) {
    showToast({ message: 'No hay archivos para eliminar.', type: 'warning' });
    return;
   } else {
    inputElement.value = "";
    dropzoneFileMessage.innerHTML = `<p>No Files Selected</p>`;
    showToast({ message: 'Elements deleted.', type: 'info' });
   }

  });

  btnSave.addEventListener("click", (e) => {
   e.preventDefault();
   if (!inputElement.files || inputElement.files.length === 0) {
    showToast({ message: 'No hay archivos para guardar.', type: 'warning' });
    return;
   }
   const totalSize = calculateTotalFileSize(inputElement.files);
   if (totalSize > fileLimit) {
    showToast({ message: 'File is over 25MB', type: 'warning' });
    alert("Files are over 25MB!");
   }
   showToast({ message: 'Files saved', type: 'success' });
   console.log("Files to warranty:", inputElement.files);

  })

 }
}