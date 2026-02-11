/* =========================
   VALIDASI DATA DIRI
========================= */

const inputs = document.querySelectorAll(".input-group input");
const errorMsg = document.getElementById("errorMsg");

/* REALTIME VALIDATION */
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

/* NEXT PAGE DATA DIRI */
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


/* =========================
   SYSTEM SOAL (CBT STYLE)
========================= */

const soal = document.querySelectorAll(".soal");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const nomorSoal = document.getElementById("nomorSoal");

let current = parseInt(localStorage.getItem("currentSoal")) || 0;

/* 🔥 ANTI ERROR */
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

    nextBtn.addEventListener("click", ()=>{

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

    backBtn.addEventListener("click", ()=>{

        current--;

        if(current < 0) current = 0;

        localStorage.setItem("currentSoal", current);

        updateSoal();
    });

    restoreJawaban();
    updateSoal();
}


/* =========================
   HALAMAN SARAN
========================= */

const submitBtn = document.getElementById("submitBtn");

if(submitBtn){

    submitBtn.addEventListener("click", ()=>{

        const data = JSON.parse(localStorage.getItem("formData")) || {};
        data.saran = document.getElementById("saran").value;

        console.log("DATA FINAL:", data);

        /* 🔥 RESET */
        localStorage.removeItem("formData");
        localStorage.removeItem("currentSoal");

        window.location.href = "thanks.html";
    });
}


/* =========================
   BACK BUTTON SARAN
========================= */

if(backBtn && soal.length === 0){

    backBtn.addEventListener("click", ()=>{
        window.location.href = "soal.html";
    });

}
