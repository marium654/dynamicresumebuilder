declare const html2pdf:any;


const form = document.getElementById("resumeform") as HTMLFormElement; // Corrected ID
const resumePage = document.getElementById("resumePage") as HTMLDivElement; // Changed to HTMLDivElement
const resumePhoto = document.getElementById("resumePhoto") as HTMLImageElement;
const resumeName = document.getElementById("resumeName") as HTMLHeadingElement;
const resumeEmail = document.getElementById("resumeEmail") as HTMLParagraphElement;
const resumePhone = document.getElementById("resumePhone") as HTMLParagraphElement;
const resumeEducation = document.getElementById("resumeEducation") as HTMLParagraphElement;
const resumeWorkExperience = document.getElementById("resumeWorkExperience") as HTMLParagraphElement;
const resumeSkills = document.getElementById("resumeSkills") as HTMLParagraphElement;
const downloadPdfButton = document.getElementById("download-pdf") as HTMLButtonElement;
const backButton = document.getElementById("backButton") as HTMLButtonElement;
const editButton = document.getElementById("editButton") as HTMLButtonElement;
const shareLinkButton = document.getElementById("shareLinkButton") as HTMLButtonElement;

form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const phone = (document.getElementById("phone") as HTMLInputElement).value;
    const degree = (document.getElementById("degree") as HTMLInputElement).value;
    const education = (document.getElementById("education") as HTMLInputElement).value; // Changed to match ID
    const workExperience = (document.getElementById("details") as HTMLInputElement).value; // Changed to match ID
    const skills = (document.getElementById("skills") as HTMLTextAreaElement).value;
    const photoInput = document.getElementById("photo") as HTMLInputElement;

    const photofile = photoInput.files ? photoInput.files[0] : null;

    let photoBase64 = '';

    if (photofile) {
        photoBase64 = await fileToBase64(photofile);

        localStorage.setItem("resumePhoto", photoBase64);
        resumePhoto.src = photoBase64;
    }

    document.querySelector(".container")?.classList.add("hidden"); 
     resumePage.classList.remove("hidden"); 

    resumeName.textContent = name;
    resumeEmail.textContent = `Email: ${email}`;
    resumePhone.textContent = `Phone: ${phone}`;
    resumeEducation.textContent = `${degree} from ${education}`;
    resumeWorkExperience.textContent = workExperience;
    resumeSkills.textContent = skills;


    const queryParams = new URLSearchParams({
        name:name,
        email:email,
        phone:phone,
        degree:degree,
        education:education,
        workExperience:workExperience,
        skills:skills,
})

     const uniqueURL = `${window.location.origin}? ${queryParams.toString()}`
     shareLinkButton.addEventListener("click" ,()=>{
        navigator.clipboard.writeText(uniqueURL);
        alert("the link is copied")

     });

     window.history.replaceState(null,'',`${queryParams.toString()}`);



    






})



function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onloadend = () => resolve(
            reader.result as string
    )
        reader.onerror = reject;
        reader.readAsDataURL(file);
          


    });
}
editButton.addEventListener('click', () =>{
    updateFormFromResume();

   document.querySelector(".container")?.classList.remove("hidden");
   resumePage.classList.add("hidden");


})

function updateFormFromResume(){


    const [degree, education] = resumeEducation.textContent?.split("From") || ``;
    (document.getElementById("name")as HTMLInputElement).value =  resumeName.textContent || ``;
    (document.getElementById("email") as HTMLInputElement).value = resumeEmail.textContent?.replace('Email:', ``) || ``;
    (document.getElementById("phone") as HTMLInputElement).value = resumePhone.textContent?.replace('Phone:', ``) || ``;
    (document.getElementById("degree") as HTMLInputElement).value = degree || ``;
    (document.getElementById("education") as HTMLInputElement).value = education || ``;
    (document.getElementById("details") as HTMLInputElement).value = resumeWorkExperience.textContent || ``;
    (document.getElementById("skills") as HTMLTextAreaElement).value = resumeSkills.textContent || ``;


}

downloadPdfButton.addEventListener("click" , () =>{
    if(typeof html2pdf === 'undefined'){
        alert('Error : html2pdf library is not loaded')
        return;
    }

const resumeOptions = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 1.0 },
    html2canvas: { scale: 2 }, 
    jsPDF: { unit: 'in', format: "letter", orientation: 'portrait' } 
};


html2pdf()
    .from(resumePage)
    .set(resumeOptions)
    .save()
    .catch((error: Error) => {
        console.error("Pdf error", error)
    })

});

window.addEventListener("DOMContentLoaded",()=>{
     const params = new URLSearchParams(window.location.search);
     const name = params.get("name") || ``;
     const email = params.get("email") || ``;
     const phone = params.get("phone") || ``;
     const degree = params.get("degree") || ``;
     const education = params.get("education") || ``;
     const workExperience = params.get("workExperience") || ``;
     const skills = params.get("skills") || ``;

     if (name || email || phone || degree || education ||workExperience || skills){
    resumeName.textContent = name;
    resumeEmail.textContent = `Email: ${email}`;
    resumePhone.textContent = `Phone: ${phone}`;
    resumeEducation.textContent = `${degree} from ${education}`;
    resumeWorkExperience.textContent = workExperience;
    resumeSkills.textContent = skills;

    const savephoto = localStorage.getItem("resumePhoto");
    if (savephoto) {
        resumePhoto.src = savephoto;
    }

     }
});


resumePhoto.style.width= "150px";
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit= "cover"; 
resumePhoto.style.borderRadius="50%"
resumePhoto.style.display= "block";
resumePhoto.style.margin = "0 auto";