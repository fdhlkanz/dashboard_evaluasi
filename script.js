/* =========================================
   CONFIG GOOGLE APPS SCRIPT
========================================= */

const scriptURL = "https://script.google.com/macros/s/AKfycbz8RQIXOCxD2Nmkrim3SQnBcTtKiA_aI4p8OQX_filytSfMGJJPwt9akSDPqtu3-r4V/exec";


/* =========================================
   VALIDASI DATA DIRI (INDEX PAGE)
========================================= */

const inputs = document.querySelectorAll(".input-group input");
const errorMsg = document.getElementById("errorMsg");

inputs.forEach(input => {

    input.addEventListener("input", () => {

        const group = input.parentElement;

        if(input.value.trim() !== ""){
            group.classList.add("valid");
            group.classList.remove("invalid");
        } else {
            group.classList.remove("valid");
            group.classList.remove("invalid");
        }

    });

});


function nextPage(){

    let valid = true;

    inputs.forEach(input => {

        const group = input.parentElement;

        if(input.value.trim() === ""){
            group.classList.add("invalid");
            group.classList.remove("valid");
            valid = false;
        }

    });

    if(!valid){
        errorMsg.innerText = "⚠ Lengkapi seluruh data terlebih dahulu";
        return;
    }

    errorMsg.innerText = "";

    const data = {
        email: document.getElementById("email")?.value,
        bimsuh: document.getElementById("bimsuh")?.value,
        tempat: document.getElementById("tempat")?.value,
        tanggal: document.getElementById("tanggal")?.value,
        waktu: document.getElementById("waktu")?.value
    };

    localStorage.setItem("formData", JSON.stringify(data));
    localStorage.setItem("currentSoal", 0);

    window.location.href = "soal.html";
}


/* =========================================
   SYSTEM SOAL (CBT STYLE)
========================================= */

const soal = document.querySelectorAll(".soal");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const nomorSoal = document.getElementById("nomorSoal");

let current = parseInt(localStorage.getItem("currentSoal")) || 0;

if(current >= soal.length) current = 0;
if(current < 0) current = 0;

if(soal.length > 0){

    function restoreJawaban(){

        const data = JSON.parse(localStorage.getItem("formData")) || {};

        soal.forEach((s, index)=>{

            const value = data["q" + (index + 1)];

            if(value){

                const radios = s.querySelectorAll("input[type=radio]");

                radios.forEach(radio => {
                    if(radio.value === value){
                        radio.checked = true;
                    }
                });
            }
        });
    }

    function updateSoal(){

        soal.forEach((s)=>{
            s.classList.remove("active");
        });

        soal[current].classList.add("active");

        nomorSoal.innerText = current + 1;

        backBtn.style.visibility = current === 0 ? "hidden" : "visible";
        nextBtn.innerText = current === soal.length - 1 ? "Selesai" : "Next";
    }

    nextBtn?.addEventListener("click", ()=>{

        const aktif = soal[current];
        const pilihan = aktif.querySelector("input[type=radio]:checked");

        if(!pilihan){
            errorMsg.innerText = "⚠ Pilih jawaban terlebih dahulu";
            return;
        }

        errorMsg.innerText = "";

        const data = JSON.parse(localStorage.getItem("formData")) || {};
        data["q" + (current + 1)] = pilihan.value;

        localStorage.setItem("formData", JSON.stringify(data));

        if(current < soal.length - 1){

            current++;
            localStorage.setItem("currentSoal", current);
            updateSoal();

        } else {

            window.location.href = "saran.html";
        }

    });

    backBtn?.addEventListener("click", ()=>{

        current--;
        if(current < 0) current = 0;

        localStorage.setItem("currentSoal", current);
        updateSoal();
    });

    restoreJawaban();
    updateSoal();
}


/* =========================================
   HALAMAN SARAN + SUBMIT KE SPREADSHEET
========================================= */

const submitBtn = document.getElementById("submitBtn");

if(submitBtn){

    submitBtn.addEventListener("click", ()=>{

        const data = JSON.parse(localStorage.getItem("formData")) || {};
        const saran = document.getElementById("saran").value;

        if(!saran){
            alert("⚠ Saran wajib diisi");
            return;
        }

        const payload = {
            email: data.email,
            nama_bimsuh: data.bimsuh,
            tempat_diklat: data.tempat,
            tanggal_diklat: data.tanggal,
            waktu_pelaksanaan: data.waktu,
            kualitas_pribadi: data.q1,
            metode_efektif: data.q2,
            tidak_keberatan: data.q3,
            kedisiplinan: data.q4,
            nilai_pembelajaran: data.q5,
            peranan_bimsuh: data.q6,
            saran_masukan: saran
        };

        submitBtn.disabled = true;
        submitBtn.innerText = "Mengirim...";

        fetch(scriptURL, {
            method: "POST",
            body: new URLSearchParams(payload)
        })
        .then(res => res.json())
        .then(response => {

            if(response.status === "success"){

                localStorage.removeItem("formData");
                localStorage.removeItem("currentSoal");

                window.location.href = "thanks.html";

            } else {

                alert("Gagal mengirim data.");
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";

            }

        })
        .catch(()=>{

            alert("Terjadi kesalahan koneksi.");
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";

        });

    });
}


/* =========================================
   BACK BUTTON SARAN
========================================= */

if(backBtn && soal.length === 0){

    backBtn.addEventListener("click", ()=>{
        window.location.href = "soal.html";
    });

}
