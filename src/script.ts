const fields = {
	name: false,
	email: false,
	phone: false
}

const expressions = {
	name: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
	email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
	phone: /^\d{11}$/
}

const form = document.getElementById('form') as HTMLFormElement;
const inputs = document.querySelectorAll<HTMLInputElement>('#form input');
const registerButton = document.getElementById('registerButton') as HTMLElement;
const subscribedButton = document.getElementById('subscribedButton') as HTMLElement;
const drawButton = document.getElementById('drawButton') as HTMLElement;
const registerContent = document.getElementById('register') as HTMLElement;
const subscribedContent = document.getElementById('subscribed') as HTMLElement;
const drawContent = document.getElementById('draw') as HTMLElement;
const drawNowButton = document.querySelector('#draw button') as HTMLElement;

inputs.forEach((input) => {
	input.addEventListener('keyup', validateForm);
	input.addEventListener('blur', validateForm);
});

function validateForm(e: Event) {
    const index = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value.trim();
    const isValid = isValidName(value, index);
    const fieldElement = document.getElementById(index + "_field") as HTMLElement;
    const iconElement = fieldElement.querySelector('i') as HTMLElement;
    const errorMessage = document.querySelector(`.${index}_error`) as HTMLElement;  
    const inputElement = document.getElementById(index) as HTMLElement;

    if (!isValid) {
        iconElement.classList.remove('fa-circle-check');
        iconElement.classList.add('fa-circle-xmark');
        errorMessage.style.display = "flex";
        inputElement.classList.add("invalidValue"); 
        fields[index] = false;
    } else {
        iconElement.classList.remove('fa-circle-xmark');
        iconElement.classList.add('fa-circle-check');
        errorMessage.style.display = "none";
        inputElement.classList.remove("invalidValue");
        fields[index] = true;
    }

    function isValidName(value: string, index: string): boolean {
        return expressions[index].test(value);
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const checkbox = document.getElementById('checkbox') as HTMLElement;
    const errorMessage = document.querySelector('.checkbox_error') as HTMLElement;
    const submitError = document.getElementById('submitError') as HTMLElement;
    const submitSuccess = document.getElementById('submitSuccess') as HTMLElement;


    if (!checkbox.checked){
        errorMessage.style.display = "flex";  
    }   

    else {
        if (fields.name && fields.email && fields.phone && checkbox.checked) {

            fetch('https://sheet.best/api/sheets/98d8167e-447d-48bc-9c09-ac3f9f92fb86', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "Name": form.name.value,
                    "Email": form.email.value,
                    "Phone": form.phone.value,
                    "Subscribed Date": getCurrentDate()
                })
            });  
            errorMessage.style.display = "none";
            submitSuccess.style.display = "flex";
        }
        
        else{
            submitError.style.display = "flex";
        }
    } 
});

function getCurrentDate(): string {
    const currentDateTime = new Date();

    const day = currentDateTime.getDate();
    const month = currentDateTime.getMonth() + 1;
    const year = currentDateTime.getFullYear();

    const hours = currentDateTime.getHours(); 
    const minutes = currentDateTime.getMinutes(); 
    const seconds = currentDateTime.getSeconds(); 

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`;
}

const messagesIcon = document.querySelectorAll('#message i, #submitError i, #submitSuccess i');

messagesIcon.forEach((messageIcon) => {
    messageIcon.addEventListener('click', closeMessage);
});

function closeMessage(this: HTMLElement) {
    const message = this.parentElement;
    message.style.display = "none";
}

subscribedButton.addEventListener('click', async () => {    

    try {
        const response = await fetch('https://sheet.best/api/sheets/98d8167e-447d-48bc-9c09-ac3f9f92fb86');
        const data = await response.json();
        const table = document.getElementById('table');

        table.innerHTML =  `<tr>
                                <th>Name</th>
                                <th>Subscribed Date</th>
                            </tr>`;

        data.map(row => {
            const content =`<tr>
                                <td class="nameCapitalize">${row.Name}</td>
                                <td>${row['Subscribed Date']}</td>
                            </tr>`;

            table.innerHTML += content;
        });
    }
    catch(error){
        console.log(error);
    }
});

drawNowButton.addEventListener('click', async () => {    
    try {
        const response = await fetch('https://sheet.best/api/sheets/98d8167e-447d-48bc-9c09-ac3f9f92fb86');
        const data = await response.json();
        const randomIndex = Math.floor(Math.random() * data.length);   
        const randomWinner = data[randomIndex];
 
        drawContent.innerHTML =`<h1>Congratulations!!!</h1>
                                <br>
                                <h2 class="nameCapitalize">${randomWinner.Name}</h2>
                                <h2>${randomWinner.Email}</h2>
                                <h2>${randomWinner.Phone}</h2>
                                <br>
                                <h2><i class="fa-solid fa-gifts fa-flip-horizontal fa-2xl"></i> You won our <i class="fa-solid fa-gifts fa-2xl"></i><br>gaming computer</h2>`;
    }
    catch(error){
        console.log(error);
    }
});

subscribedButton.addEventListener('click', () => {
    subscribedContent.style.display = "block";
    registerContent.style.display = "none";
    drawContent.style.display = "none"
    subscribedButton.classList.add('active');
    registerButton.classList.remove('active');
    drawButton.classList.remove('active');
})

registerButton.addEventListener('click', () => {
    subscribedContent.style.display = "none";
    registerContent.style.display = "flex";
    drawContent.style.display = "none"
    subscribedButton.classList.remove('active');
    registerButton.classList.add('active');
    drawButton.classList.remove('active');
})

drawButton.addEventListener('click', () => {
    subscribedContent.style.display = "none";
    registerContent.style.display = "none";
    drawContent.style.display = "flex"
    subscribedButton.classList.remove('active');
    registerButton.classList.remove('active');
    drawButton.classList.add('active');
})

